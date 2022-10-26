from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView 

# Create your views here.

class Inicio(LoginRequiredMixin, TemplateView):
	template_name = 'inicio.html'
