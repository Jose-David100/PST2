from django.views.generic import ListView, CreateView, UpdateView, DetailView
from apps.core.models import Vacunas
from apps.core.forms import VacunasForm
from django.urls import reverse_lazy

class ListadoVacunas(ListView):
	model = Vacunas
	template_name = 'vacunas/Listado_vacunas.html'
	context_object_name = 'Vacunas'

class RegistrarVacunas(CreateView):
	model = Vacunas
	form_class = VacunasForm
	template_name = 'vacunas/Vacunas_form.html'
	success_url = reverse_lazy('list_vacunas')

class EditarVacuna(UpdateView):
	model = Vacunas
	form_class = VacunasForm
	template_name = 'vacunas/Editar_vacunas.html'
	success_url = reverse_lazy('list_vacunas')