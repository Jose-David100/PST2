from django.views.generic import ListView, CreateView, UpdateView, DetailView, TemplateView,View
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Encargado
from apps.core.forms import EncargadosForm


class EditarEncargado(UpdateView):
	model = Encargado
	template_name= 'encargados/Editar_encargados.html'
	form_class = EncargadosForm
	success_url = reverse_lazy('list_encargados')

class DetalleEncargados(DetailView):
	model = Encargado
	template_name= 'encargados/Detalles_encargado.html'
	context_object_name= 'Encargado'


# ENCARGADOS 
class EncargadoViews(TemplateView):
	template_name =  'encargados/Listado_encargados.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_encargado':
				data = []
				for i in Encargado.objects.all():
					data.append(i.toJSON())

			elif action == 'agregar_encargado':
				enc = Encargado()
				enc.cedula = request.POST.get('cedula')
				enc.nombre = request.POST.get('nombre')
				enc.apellido = request.POST.get('apellido')
				enc.movil = request.POST.get('movil')
				enc.direccion = request.POST.get('direccion')
				enc.save()

			elif action == 'editar_encargado':	
				enc = Encargado.objects.get(cedula = request.POST.get('cedula'))
				enc.movil = request.POST.get('movil')
				enc.direccion = request.POST.get('direccion')
				enc.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(EncargadoViews, self).get_context_data(**kwargs)
		context['form'] = EncargadosForm()
		return context