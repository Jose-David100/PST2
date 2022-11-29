from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from apps.core.mixins import Perms_Check

# IMPORTACIONES PARA LOS REPORTES
import os
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from django.contrib.staticfiles import finders
from django.views.generic.base import TemplateView
from xhtml2pdf import pisa
from django.utils import timezone
from django.contrib.auth.decorators import login_required, permission_required
from django.utils.decorators import method_decorator
import datetime
from datetime import datetime
from django.utils.dateparse import parse_date
from datetime import timedelta, date

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
			data = []
			for i in DetalleIngreso.objects.filter(vacuna = request.POST.get('id')):
				data.append(i.toJSON())
				
		elif action == "detalle_salida":
			data = []
			for i in DetalleSalida.objects.filter(vacuna = request.POST.get('id')):
				data.append(i.toJSON())
			
		else:
			data['error'] = 'Ha ocurrido un error inesperado'

		return JsonResponse(data, safe=False)

# REPORTES 

# SALIDA DE VACUNAS
@login_required(redirect_field_name='login')
@permission_required('core.view_vacunas', '/')
def SalidaVacunas(request, fecha1, fecha2):
	template_path= 'vacunas/reportes/salida_vacunas.html'
	today = timezone.now()
	now = datetime.now()
	fecha1 = parse_date(fecha1)
	fecha2 = parse_date(fecha2)
	fecha2 = fecha2 + timedelta(days=1)
	vac = DetalleSalida.objects.filter(salida__fecha_salida__gte = fecha1, salida__fecha_salida__lt= fecha2 )
	fecha2 = fecha2 - timedelta(days=1)
	context = {
		'obj':vac,
		'today':today,
		'hour': now,
		'fecha1': fecha1,
		'fecha2': fecha2,
		'request':request
	}

	response = HttpResponse(content_type='application/pdf')
	#response['Content-Disposition'] = 'inline; filename="salida_de_vacunas.pdf"'
	template = get_template(template_path)
	html = template.render(context)

	pisaStatus = pisa.CreatePDF(html, dest=response)
	if pisaStatus.err:
	   return HttpResponse('We had some errors <pre>' + html + '</pre>')
	return response

# INGRESO DE VACUNAS
@login_required(redirect_field_name='login')
@permission_required('core.view_vacunas', '/')
def IngresoVacunas(request, fecha1, fecha2):
	template_path= 'vacunas/reportes/ingreso_vacunas.html'
	today = timezone.now()
	now = datetime.now()
	fecha1 = parse_date(fecha1)
	fecha2 = parse_date(fecha2)
	fecha2 = fecha2 + timedelta(days=1)
	vac = DetalleIngreso.objects.filter(ingreso__fecha_ingreso__gte = fecha1, ingreso__fecha_ingreso__lt = fecha2 )
	fecha2 = fecha2 - timedelta(days=1)
	context = {
		'obj':vac,
		'today':today,
		'hour': now,
		'fecha1': fecha1,
		'fecha2': fecha2,
		'request':request
	}

	response = HttpResponse(content_type='application/pdf')
	#response['Content-Disposition'] = 'inline; filename="ingreso_de_vacunas.pdf"'
	template = get_template(template_path)
	html = template.render(context)

	pisaStatus = pisa.CreatePDF(html, dest=response)
	if pisaStatus.err:
	   return HttpResponse('We had some errors <pre>' + html + '</pre>')
	return response