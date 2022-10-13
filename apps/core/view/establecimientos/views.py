from django.views.generic import ListView, CreateView, UpdateView, DetailView
from apps.core.models import Establecimiento
from apps.core.forms import EstablecimientoForm
from django.urls import reverse_lazy

class ListadoEstablecimiento(ListView):
	model = Establecimiento
	template_name= 'establecimientos/Listado_establecimiento.html'
	context_object_name= 'Establecimiento'

class RegistrarEstablecimiento(CreateView):
	model = Establecimiento
	template_name= 'establecimientos/Establecimiento_form.html'
	form_class = EstablecimientoForm
	success_url = reverse_lazy('list_establecimientos')

class EditarEstablecimiento(UpdateView):
	model = Establecimiento
	template_name= 'establecimientos/Editar_establecimiento.html'
	form_class = EstablecimientoForm
	success_url = reverse_lazy('list_establecimientos')
"""
class DetalleEstablecimiento(DetailView):
	model = Establecimiento
	template_name= 'establecimientos/Detalles_encargado.html'
	context_object_name= 'Establecimiento'
"""