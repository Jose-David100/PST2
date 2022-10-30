from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy


# IMPORTACIONES DE MODELOS
from apps.core.models import Establecimiento, Encargado
from apps.core.forms import EstablecimientoForm

# ESTABLECIMIENTOS 
class EstablecimientosViews(LoginRequiredMixin, TemplateView):
	template_name =  'establecimientos/Listado_establecimiento.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_establecimiento':
				data = []
				for i in Establecimiento.objects.all():
					data.append(i.toJSON())

			elif action == 'agregar_establecimiento':
				esta = Establecimiento()
				esta.nombre = request.POST.get('nombre')
				esta.direccion = request.POST.get('direccion')
				esta.encargado = Encargado.objects.get(id = request.POST.get('encargado')) 
				esta.save()

			elif action == 'editar_establecimiento':	
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
		context['encargado'] = EstablecimientoForm()
		return context