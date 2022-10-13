from django.views.generic import ListView, CreateView, UpdateView, DetailView
from apps.core.models import Personal
from apps.core.forms import PersonalForm
from django.shortcuts import redirect 
from django.urls import reverse_lazy
# Create your views here.

class ListadoPersonal(ListView):
	template_name = 'personal/ListadoPersonal.html'
	model = Personal
	context_object_name = 'Personal'

class RegistrarPersonal(CreateView):
	template_name = 'personal/Personal_form.html'
	model = Personal
	form_class = PersonalForm
	success_url = reverse_lazy('list_personal')

class EditarPersonal(UpdateView):
	template_name = 'personal/Editar_personal_form.html'
	model = Personal
	form_class = PersonalForm
	success_url = reverse_lazy('list_personal')

class DetallesPersonal(DetailView):
	template_name = 'personal/Detalles_personal.html'
	model = Personal
	context_object_name = 'Personal'