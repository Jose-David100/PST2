from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
import json
from django.db import transaction
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Salida, DetalleSalida, Vacunas, Personal, Establecimiento
from apps.core.forms import DetalleSalidaForm, SalidaForm

# SALIDAS 
class SalidaViews(LoginRequiredMixin,Perms_Check, TemplateView):
	template_name =  'salida/Listado_salida.html'
	permission_required = 'core.view_salida'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_salida':
				perms = ('core.view_salida',)
				if request.user.has_perms(perms):
					data = []
					for i in Salida.objects.all().order_by('-id'):
						data.append(i.toJSON())

			elif action == 'detalle_salida':
				perms = ('core.view_salida',)
				if request.user.has_perms(perms):
					data = []
					for i in DetalleSalida.objects.filter(salida = request.POST.get('id')):
						data.append(i.toJSON())

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(SalidaViews, self).get_context_data(**kwargs)
		return context

class SalidasForm(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name =  'salida/salidas_form.html'
	permission_required = 'core.view_salida'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']

			if action == 'listado_vacunas':
				perms = ('core.add_salida',)
				if request.user.has_perms(perms):
					data = []
					ids_exclude = json.loads(request.POST['ids'])
					vacunas = Vacunas.objects.filter(nombre__icontains=request.POST['term'], existencia__gte=1)
					for i in vacunas.exclude(id__in=ids_exclude)[0:10]:
						item = i.toJSON()
						item['id'] = i.id
						item['nombre'] = i.nombre
						item['existencia'] = i.existencia
						item['presentacion'] = i.presentacion
						data.append(item)	

			elif action == 'agregar_salida':
				perms = ('core.add_salida',)
				if request.user.has_perms(perms):
					with transaction.atomic():
						salida_js = json.loads(request.POST['vents'])

						salida = Salida()

						salida.personal = Personal.objects.get(id = salida_js['personal'])
						salida.establecimiento = Establecimiento.objects.get(id = salida_js['establecimiento'])
						salida.fecha_salida = salida_js['fecha']
						salida.observacion = salida_js['observacion']
						salida.save()

						for i in salida_js['det']:
							det_salida = DetalleSalida()
							det_salida.salida = Salida.objects.get(id = salida.id)
							det_salida.vacuna = Vacunas.objects.get(id = i['id'])
							det_salida.cantidad = i['cantidad']
							det_salida.lote = i['lote']
							det_salida.fecha_vencimiento = i['fecha_ven']
							det_salida.save()

							vac = Vacunas.objects.get(id= i['id'])
							vac.existencia = (int(vac.existencia) - int(i['cantidad']))
							vac.save()


			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(SalidasForm, self).get_context_data(**kwargs)
		context['form'] = DetalleSalidaForm()
		context['form2'] = SalidaForm()
		return context


