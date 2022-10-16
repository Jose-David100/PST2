from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Ingreso, DetalleIngreso, Vacunas
from apps.core.forms import DetalleIngresoForm

# INGRESOS 
class IngresoViews(TemplateView):
	template_name =  'ingresos/Listado_ingresos.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_ingreso':
				data = []
				for i in DetalleIngreso.objects.all().order_by('-id'):
					data.append(i.toJSON())

			elif action == 'agregar_ingreso':
				ing = Ingreso()
				ing.fecha_ingreso = request.POST.get('fecha_ingreso')
				ing.observacion = request.POST.get('observacion')
				ing.save()

				det_ing = DetalleIngreso()
				det_ing.ingreso = Ingreso.objects.get(id = ing.id)
				det_ing.vacuna = Vacunas.objects.get(id = request.POST.get('vacuna') )
				det_ing.cantidad_ingreso = request.POST.get('cantidad_ingreso')
				det_ing.save()

				vac = Vacunas.objects.get(id = request.POST.get('vacuna'))
				vac.existencia = (int(vac.existencia) + int(det_ing.cantidad_ingreso))
				vac.save()

			elif action == 'editar_ingreso':	
				ing = Ingreso.objects.get(id = request.POST.get('id_ingreso'))
				ing.fecha_ingreso = request.POST.get('fecha_ingreso')
				ing.observacion = request.POST.get('observacion')
				ing.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(IngresoViews, self).get_context_data(**kwargs)
		context['form'] = DetalleIngresoForm()
		return context