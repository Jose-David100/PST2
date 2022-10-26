from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
import json
from django.db import transaction

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Salida, DetalleSalida, Vacunas, Personal, Establecimiento
from apps.core.forms import DetalleSalidaForm, SalidaForm

# SALIDAS 
class SalidaViews(LoginRequiredMixin, TemplateView):
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

			elif action == 'listado_vacunas':
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
				with transaction.atomic():
					salida_js = json.loads(request.POST['vents'])

					salida = Salida()

					salida.personal = Personal.objects.get(cedula = salida_js['personal'])
					salida.establecimiento = Establecimiento.objects.get(id = salida_js['establecimiento'])
					salida.fecha_salida = salida_js['fecha']
					salida.observacion = salida_js['observacion']
					salida.save()

					for i in salida_js['det']:
						det_salida = DetalleSalida()
						det_salida.salida = Salida.objects.get(id = salida.id)
						det_salida.vacuna = Vacunas.objects.get(id = i['id'])
						det_salida.cantidad = i['cantidad']
						det_salida.save()

						vac = Vacunas.objects.get(id= i['id'])
						vac.existencia = (int(vac.existencia) - int(i['cantidad']))
						vac.save()

				# dispo = Vacunas.objects.get(id = request.POST.get('vacuna'))
				# if int(request.POST.get('cantidad')) > int(dispo.existencia):
				# 	data['error'] = 'No hay suficientes vacunas para sacar esa cantidad'
				# else:

				# 	sal = Salida()
				# 	sal.personal = Personal.objects.get(cedula = request.POST.get('personal'))
				# 	sal.establecimiento = Establecimiento.objects.get(id = request.POST.get('establecimiento')) 
				# 	sal.fecha_salida = request.POST.get('fecha_salida')
				# 	sal.save()

				# 	det_sal = DetalleSalida()
				# 	det_sal.salida = Salida.objects.get(id = sal.id)
				# 	det_sal.vacuna = Vacunas.objects.get(id = request.POST.get('vacuna') )
				# 	det_sal.cantidad = request.POST.get('cantidad')
				# 	det_sal.observacion = request.POST.get('observacion')
				# 	det_sal.save()

				# 	vac = Vacunas.objects.get(id = request.POST.get('vacuna'))
				# 	vac.existencia = (int(vac.existencia) - int(det_sal.cantidad))
				# 	vac.save()

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