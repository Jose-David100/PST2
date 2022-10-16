from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Salida, DetalleSalida, Vacunas, Personal, Establecimiento
from apps.core.forms import DetalleSalidaForm, SalidaForm

# SALIDAS 
class SalidaViews(TemplateView):
	template_name =  'salida/Listado_salida.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_salida':
				data = []
				for i in DetalleSalida.objects.all().order_by('-id'):
					data.append(i.toJSON())

			elif action == 'agregar_salida':
				
				sal = Salida()
				sal.personal = Personal.objects.get(cedula = request.POST.get('personal'))
				sal.establecimiento = Establecimiento.objects.get(id = request.POST.get('establecimiento')) 
				sal.fecha_salida = request.POST.get('fecha_salida')
				sal.save()

				det_sal = DetalleSalida()
				det_sal.salida = Salida.objects.get(id = sal.id)
				det_sal.vacuna = Vacunas.objects.get(id = request.POST.get('vacuna') )
				det_sal.cantidad = request.POST.get('cantidad')
				det_sal.observacion = request.POST.get('observacion')
				det_sal.save()

				vac = Vacunas.objects.get(id = request.POST.get('vacuna'))
				vac.existencia = (int(vac.existencia) - int(det_sal.cantidad))
				vac.save()

			elif action == 'editar_salida':	
				pass
				# ing = Ingreso.objects.get(id = request.POST.get('id_ingreso'))
				# ing.fecha_ingreso = request.POST.get('fecha_ingreso')
				# ing.observacion = request.POST.get('observacion')
				# ing.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(SalidaViews, self).get_context_data(**kwargs)
		context['form'] = DetalleSalidaForm()
		context['form2'] = SalidaForm()
		return context