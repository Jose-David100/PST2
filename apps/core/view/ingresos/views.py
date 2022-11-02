from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from django.urls import reverse_lazy
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Ingreso, DetalleIngreso, Vacunas, Personal
from apps.core.forms import DetalleIngresoForm

# INGRESOS 
class IngresoViews(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name =  'ingresos/Listado_ingresos.html'
	permission_required = 'core.view_ingreso'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_ingreso':
				perms = ('core.view_ingreso',)
				if request.user.has_perms(perms):
					data = []
					for i in Ingreso.objects.all().order_by('-id'):
						data.append(i.toJSON())

			elif action == 'detalle_ingreso':
				perms = ('core.view_ingreso',)
				if request.user.has_perms(perms):	
					data = []
					for i in DetalleIngreso.objects.filter(ingreso = request.POST.get('id')):
						data.append(i.toJSON())

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
		 	data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(IngresoViews, self).get_context_data(**kwargs)
		return context

class Ingresoform(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name =  'ingresos/ingreso_form.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_vacunas':
				perms = ('core.add_ingreso',)
				if request.user.has_perms(perms):
					data = []
					ids_exclude = json.loads(request.POST['ids'])
					vacunas = Vacunas.objects.filter(nombre__icontains=request.POST['term'])
					for i in vacunas.exclude(id__in=ids_exclude)[0:10]:
						item = i.toJSON()
						item['id'] = i.id
						item['nombre'] = i.nombre
						item['presentacion'] = i.presentacion
						data.append(item)	

			elif action == 'agregar_ingreso':
				perms = ('core.add_ingreso',)
				if request.user.has_perms(perms):
					ingreso = json.loads(request.POST['vents'])

					ing = Ingreso()
					ing.fecha_ingreso = ingreso['fecha']
					ing.observacion = ingreso['observacion']
					ing.personal = Personal.objects.get(cedula = ingreso['personal'])
					ing.save()

					for i in ingreso['det']:
						print(i)
						det_ing = DetalleIngreso()
						det_ing.ingreso = Ingreso.objects.get(id = ing.id)
						det_ing.vacuna = Vacunas.objects.get(id = i['id'])
						det_ing.cantidad_ingreso = int(i['cantidad_ingreso'])
						det_ing.lote = i['lote']
						det_ing.fecha_vencimiento = i['fecha_vencimiento']
						det_ing.save()

						vac = Vacunas.objects.get(id = i['id'])
						vac.existencia = (int(vac.existencia) + int(det_ing.cantidad_ingreso))
						vac.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
			
		return JsonResponse(data, safe=False)
	
	def get_context_data(self, **kwargs):
		context = super(Ingresoform, self).get_context_data(**kwargs)
		context['form'] = DetalleIngresoForm()
		context['per'] = Personal.objects.filter(status = 'Activo', ocupacion = 'Administrativo')
		return context