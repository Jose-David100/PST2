from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE LOS MODELOS Y LOS FORMULARIOS
from apps.core.models import Personal, Usuarios
from apps.core.forms import PersonalForm


# Create your views here.

# PERSONAL 
class PersonalViews(Perms_Check, LoginRequiredMixin, TemplateView):
	permission_required = 'core.view_personal'
	template_name =  'personal/ListadoPersonal.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'listado_personal':
				perms = ('core.view_personal',)
				if request.user.has_perms(perms):
					data = []
					for i in Personal.objects.all():
						data.append(i.toJSON())

			elif action == 'agregar_personal':
				perms = ('core.add_personal',)
				if request.user.has_perms(perms):
					if Personal.objects.filter(cedula = request.POST.get('cedula')):
						data['error'] = 'Ya existe personal registrado con este numero de cédula'   
					else:
						per = Personal()
						print(request.POST)
						per.cedula = request.POST.get('cedula')
						per.nombre = request.POST.get('nombre')
						per.apellido = request.POST.get('apellido')
						per.direccion = request.POST.get('direccion')
						per.movil = request.POST.get('movil')
						per.correo = request.POST.get('correo')
						per.ocupacion = request.POST.get('ocupacion')
						per.sexo = request.POST.get('sexo')
						per.status = request.POST.get('status')
						per.rol_sistema = request.POST.get('rol_sistema')
						per.save()

			elif action == 'editar_personal':
				perms = ('core.change_personal',)
				if request.user.has_perms(perms):
					per = Personal.objects.get(pk = request.POST['id'])
					ci_antigua = per.cedula
					if per.cedula == request.POST.get('cedula'):
						per.nombre = request.POST.get('nombre')
						per.apellido = request.POST.get('apellido')
						per.direccion = request.POST.get('direccion')
						per.movil = request.POST.get('movil')
						per.correo = request.POST.get('correo')
						if request.POST.get('ocupacion'):
							per.ocupacion = request.POST.get('ocupacion')
						else:
							per.ocupacion = per.ocupacion
						per.status = request.POST.get('status')
						per.rol_sistema = request.POST.get('rol_sistema')
						per.save()

						if Usuarios.objects.filter(username = ci_antigua):
								user = Usuarios.objects.get(username = ci_antigua)
								user.first_name = per.nombre
								user.last_name =  per.apellido
								user.email = per.correo
								user.save()
						
					else:
						if Personal.objects.filter(cedula = request.POST.get('cedula')):
							data['error'] = 'Ya existe personal registrado con este numero de cédula'   
						else:
							per.cedula = request.POST.get('cedula')
							per.nombre = request.POST.get('nombre')
							per.apellido =request.POST.get('apellido')
							per.direccion = request.POST.get('direccion')
							per.movil = request.POST.get('movil')
							per.correo = request.POST.get('correo')
							if request.POST.get('ocupacion'):
								per.ocupacion = request.POST.get('ocupacion')
							else:
								per.ocupacion = per.ocupacion
							per.status = request.POST.get('status')
							per.rol_sistema = request.POST.get('rol_sistema')
							per.save()

							if Usuarios.objects.filter(username = ci_antigua):
								user = Usuarios.objects.get(username = ci_antigua)
								user.username = per.cedula
								user.first_name = per.nombre
								user.last_name =  per.apellido
								user.email = per.correo
								user.save()
			
			elif action == 'delete_personal':
				perms = ('core.delete_personal',)
				if request.user.has_perms(perms):
					per = Personal.objects.get(id = request.POST.get('id'))
					per.delete()

			elif action == 'activar_personal':
				perms = ('core.change_personal',)
				if request.user.has_perms(perms):
					per = Personal.objects.get(id = request.POST.get('id'))
					per.status = 'Activo'
					per.save()

			elif action == 'desactivar_personal':
				perms = ('core.change_personal',)
				if request.user.has_perms(perms):
					per = Personal.objects.get(id = request.POST.get('id'))
					per.status = 'Inactivo'
					per.save()
				
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)

		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(PersonalViews, self).get_context_data(**kwargs)
		context['form'] = PersonalForm()
		return context