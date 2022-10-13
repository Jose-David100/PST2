from django.views.generic import ListView, CreateView, UpdateView, DetailView
from apps.core.models import Reposos
from apps.core.forms import ReposoForm
from django.urls import reverse_lazy

class ListadoReposos(ListView):
	model = Reposos
	template_name = 'reposos/Listado_reposo.html'
	context_object_name = 'Reposos'

class RegistrarReposo(CreateView):
	model = Reposos
	form_class = ReposoForm
	template_name = 'reposos/Reposo_form.html'
	success_url = reverse_lazy('list_reposos')

class EditarReposo(UpdateView):
	model = Reposos
	form_class = ReposoForm
	template_name = 'reposos/Editar_reposo.html'
	success_url = reverse_lazy('list_reposos')

class DetalleReposo(DetailView):
	model = Reposos
	template_name = 'reposos/Detalle_reposo.html'
	context_object_name = 'Reposos'