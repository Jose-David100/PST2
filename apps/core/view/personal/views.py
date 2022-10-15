from django.views.generic import ListView, CreateView, UpdateView, DetailView, TemplateView,View
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy

# IMPORTACIONES DE LOS MODELOS Y LOS FORMULARIOS
from apps.core.models import Personal
from apps.core.forms import PersonalForm


# Create your views here.

class EditarPersonal(UpdateView):
	template_name = 'personal/Editar_personal_form.html'
	model = Personal
	form_class = PersonalForm
	success_url = reverse_lazy('list_personal')

class DetallesPersonal(DetailView):
	template_name = 'personal/Detalles_personal.html'
	model = Personal
	context_object_name = 'Personal'

# ESTABLECIMIENTOS 
class PersonalViews(TemplateView):
	template_name =  'personal/ListadoPersonal.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_personal':
				data = []
				for i in Personal.objects.all():
					data.append(i.toJSON())

			elif action == 'agregar_personal':
				per = Personal()
				per.cedula = request.POST.get('cedula')
				per.nombre = request.POST.get('nombre')
				per.apellido = request.POST.get('apellido')
				per.direccion = request.POST.get('direccion')
				per.movil = request.POST.get('movil')
				per.ocupacion = request.POST.get('ocupacion')
				per.sexo = request.POST.get('sexo')
				per.status = "Activo"
				per.save()

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
		context = super(PersonalViews, self).get_context_data(**kwargs)
		context['form'] = PersonalForm()
		return context