from django.views.generic import ListView, CreateView, UpdateView, DetailView, TemplateView,View
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy

# IMPORTACIONES DE LOS MODELS Y FORMULARIOS
from apps.core.models import Vacunas
from apps.core.forms import VacunasForm

class EditarVacuna(UpdateView):
	model = Vacunas
	form_class = VacunasForm
	template_name = 'vacunas/Editar_vacunas.html'
	success_url = reverse_lazy('list_vacunas')

# VACUNAS 
class VacunasViews(TemplateView):
	template_name =  'vacunas/Listado_vacunas.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_vacunas':
				data = []
				for i in Vacunas.objects.all():
					data.append(i.toJSON())

			elif action == 'agregar_vacunas':
				vac = Vacunas()
				vac.nombre = request.POST.get('nombre')
				vac.presentacion = request.POST.get('presentacion')
				vac.existencia = request.POST.get('existencia')
				vac.save()

			elif action == 'editar_establecimiento':	
				pass
			elif action == 'detalles_establecimiento':
				pass
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(VacunasViews, self).get_context_data(**kwargs)
		context['form'] = VacunasForm()
		return context