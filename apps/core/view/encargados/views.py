from django.views.generic import ListView, CreateView, UpdateView, DetailView
from apps.core.models import Encargado
from apps.core.forms import EncargadosForm
from django.urls import reverse_lazy

class ListadoEncargados(ListView):
	model = Encargado
	template_name= 'encargados/Listado_encargados.html'
	context_object_name= 'Encargado'

class RegistrarEncargado(CreateView):
	model = Encargado
	template_name= 'encargados/Encargados_form.html'
	form_class = EncargadosForm
	success_url = reverse_lazy('list_encargados')

class EditarEncargado(UpdateView):
	model = Encargado
	template_name= 'encargados/Editar_encargados.html'
	form_class = EncargadosForm
	success_url = reverse_lazy('list_encargados')

class DetalleEncargados(DetailView):
	model = Encargado
	template_name= 'encargados/Detalles_encargado.html'
	context_object_name= 'Encargado'