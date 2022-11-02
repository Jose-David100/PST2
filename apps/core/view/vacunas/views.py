from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE LOS MODELS Y FORMULARIOS
from apps.core.models import DetalleSalida, Vacunas, DetalleIngreso
from apps.core.forms import VacunasForm

# VACUNAS 
class VacunasViews(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name =  'vacunas/Listado_vacunas.html'
	permission_required = 'core.view_vacunas'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_vacunas':
				perms = ('core.view_vacunas',)
				if request.user.has_perms(perms):
					data = []
					for i in Vacunas.objects.all():
						data.append(i.toJSON())

			elif action == 'agregar_vacunas':
				perms = ('core.add_vacunas',)
				if request.user.has_perms(perms):
					vac = Vacunas()
					vac.nombre = request.POST.get('nombre')
					vac.presentacion = request.POST.get('presentacion')
					vac.existencia = 0
					vac.save()

			elif action == 'editar_vacuna':
				perms = ('core.change_vacunas',)
				if request.user.has_perms(perms):	
					vac = Vacunas.objects.get(id = request.POST.get('id'))
					vac.nombre = request.POST.get('nombre')
					vac.presentacion = request.POST.get('presentacion')
					vac.existencia = request.POST.get('existencia')
					vac.save()
			
			elif action == 'detalle_vacuna':
				perms = ('core.view_vacunas',)
				if request.user.has_perms(perms):	
					data = []
					for i in DetalleIngreso.objects.filter(vacuna = request.POST.get('id')):
						data.append(i.toJSON())
			
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(VacunasViews, self).get_context_data(**kwargs)
		context['form'] = VacunasForm()
		return context

# DETALLES DE LAS SALIDAS Y ENTRADAS DE LAS VACUNAS
class MovimientosVacunas(LoginRequiredMixin,View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		action = request.POST['action']

		if action == "detalle_ingreso":
			print(request.POST)
			data = []
			for i in DetalleIngreso.objects.filter(vacuna = request.POST.get('id')):
				data.append(i.toJSON())
				
		elif action == "detalle_salida":
			print(request.POST)
			data = []
			for i in DetalleSalida.objects.filter(vacuna = request.POST.get('id')):
				data.append(i.toJSON())
            
		else:
			data['error'] = 'Ha ocurrido un error inesperado'

		return JsonResponse(data, safe=False)