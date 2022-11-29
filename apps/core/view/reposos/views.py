from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
from datetime import timedelta, date, datetime
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE LOS MODELS Y FORMULARIOS
from apps.core.models import Reposos, Personal
from apps.core.forms import ReposoForm

# REPOSOS 
class RepososViews(LoginRequiredMixin,Perms_Check, TemplateView):
	template_name =  'reposos/Listado_reposo.html'
	permission_required = 'core.view_reposos'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_reposos':
				perms = ('core.view_reposos',)
				if request.user.has_perms(perms):
					data = []
					for i in Reposos.objects.all():
						data.append(i.toJSON())

			elif action == 'agregar_reposos':
				perms = ('core.add_reposos',)
				if request.user.has_perms(perms):
					rep = Reposos()
					rep.personal = Personal.objects.get(id = request.POST.get('personal'))
					rep.motivo_reposo = request.POST.get('motivo_reposo')
					rep.duracion = request.POST.get('duracion')
					rep.fecha_inicio = request.POST.get('fecha_inicio')
					inicio = datetime.strptime(rep.fecha_inicio, '%Y-%m-%d')
					fin = timedelta(int(request.POST.get('duracion')) )
					rep.fecha_ingreso = inicio + fin
					rep.status = request.POST.get('status')
					rep.save()

					if request.POST.get('status') == 'Aprobado':
						# INACTIVANDO EL PERSONAL SOLICITANTE DEL REPOSO
						per = Personal.objects.get(id = request.POST.get('personal'))
						per.status = 'Inactivo'
						per.save()

			elif action == 'editar_reposo':	
				perms = ('core.change_reposos',)
				if request.user.has_perms(perms):
					rep = Reposos.objects.get(id = request.POST.get('id'))
					rep.motivo_reposo = request.POST.get('motivo_reposo')
					rep.duracion = request.POST.get('duracion')
					rep.fecha_inicio = request.POST.get('fecha_inicio')
					inicio = datetime.strptime(rep.fecha_inicio, '%Y-%m-%d')
					fin = timedelta(int(request.POST.get('duracion')) )
					rep.fecha_ingreso = inicio + fin
					rep.status = request.POST.get('status')
					rep.save()

					if request.POST.get('status') == 'Aprobado':
						# INACTIVANDO EL PERSONAL SOLICITANTE DEL REPOSO
						per = Personal.objects.get(id = request.POST.get('personal'))
						per.status = 'Inactivo'
						per.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(RepososViews, self).get_context_data(**kwargs)
		context['form'] = ReposoForm()
		context['personal'] = Personal.objects.filter(status = "Activo")
		return context