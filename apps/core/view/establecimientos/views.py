from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE MODELOS
from apps.core.models import Establecimiento, Encargado
from apps.core.forms import EstablecimientoForm

# ESTABLECIMIENTOS 
class EstablecimientosViews(LoginRequiredMixin,Perms_Check, TemplateView):
	template_name =  'establecimientos/Listado_establecimiento.html'
	permission_required = 'core.view_establecimiento'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_establecimiento':
				perms = ('core.view_establecimiento',)
				if request.user.has_perms(perms):
					data = []
					for i in Establecimiento.objects.all():
						data.append(i.toJSON())

			elif action == 'agregar_establecimiento':
				perms = ('core.add_establecimiento',)
				if request.user.has_perms(perms):
					esta = Establecimiento()
					esta.nombre = request.POST.get('nombre')
					esta.direccion = request.POST.get('direccion')
					esta.encargado = Encargado.objects.get(id = request.POST.get('encargado')) 
					esta.save()

			elif action == 'editar_establecimiento':
				perms = ('core.change_establecimiento',)
				if request.user.has_perms(perms):
					print(request.POST)	
					esta = Establecimiento.objects.get(nombre = request.POST.get('nombre'))
					esta.direccion = request.POST.get('direccion')
					esta.encargado = Encargado.objects.get(id = request.POST.get('encargado'))
					esta.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(EstablecimientosViews, self).get_context_data(**kwargs)
		context['encargado'] = Encargado.objects.all()
		return context