from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE MOS MODELS Y LOS FORMUALARIOS
from apps.core.models import Encargado
from apps.core.forms import EncargadosForm

# ENCARGADOS 
class EncargadoViews(LoginRequiredMixin,Perms_Check, TemplateView):
	template_name =  'encargados/Listado_encargados.html'
	permission_required = 'core.view_encargado'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_encargado':
				perms = ('core.view_encargado',)
				if request.user.has_perms(perms):
					data = []
					for i in Encargado.objects.all():
						data.append(i.toJSON())

			elif action == 'agregar_encargado':
				perms = ('core.add_encargado',)
				if request.user.has_perms(perms):
					if Encargado.objects.filter(cedula = request.POST.get('cedula')):
						data['error'] = 'Ya existe un encargado registrado con esta cedula'
					else:
						enc = Encargado()
						enc.cedula = request.POST.get('cedula')
						enc.nombre = request.POST.get('nombre')
						enc.apellido = request.POST.get('apellido')
						enc.movil = request.POST.get('movil')
						enc.direccion = request.POST.get('direccion')
						enc.correo = request.POST.get('correo')
						enc.funcion = request.POST.get('funcion')
						enc.save()

			elif action == 'editar_encargado':
				perms = ('core.change_encargado',)
				if request.user.has_perms(perms):	
					enc = Encargado.objects.get(cedula = request.POST.get('cedula'))
					if enc.cedula == request.POST.get('cedula'):
						enc.movil = request.POST.get('movil')
						enc.direccion = request.POST.get('direccion')
						enc.correo = request.POST.get('correo')
						enc.funcion = request.POST.get('funcion')
						enc.save()
					else:
						if Encargado.objects.filter(cedula = request.POST.get('cedula')):
							data['error'] = 'Ya existe un encargado registrado con esta cedula'
						else:
							enc.cedula == request.POST.get('cedula')
							enc.movil = request.POST.get('movil')
							enc.direccion = request.POST.get('direccion')
							enc.correo = request.POST.get('correo')
							enc.funcion = request.POST.get('funcion')
							enc.save()

			elif action == "delete_encargado":
				enc = Encargado.objects.get(id = request.POST.get('id'))
				enc.delete()
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(EncargadoViews, self).get_context_data(**kwargs)
		context['form'] = EncargadosForm()
		return context