from apps.core.models import Personal
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
from apps.core.mixins import Perms_Check
import json

# IMPORTACIONES DE LOS MODELS Y FORMULARIOS
from apps.core.models import Usuarios
from apps.core.forms import UserForm
# USUARIOS 

class UsuariosViews(LoginRequiredMixin,Perms_Check, TemplateView):
	template_name = 'usuarios/Usuarios_list.html'
	permission_required = 'core.view_usuarios'

	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def get(self, request, *args, **kwargs):
		data = {}
		try:
			perms = ('core.view_usuarios',)
			if request.user.has_perms(perms):
				obj = Usuarios.objects.all()

		except Exception as e:
			data['error'] = str(e)

		return render(request, self.template_name, {'obj': obj})

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']

			if action == 'delete_user':
				perms = ('core.delete_usuarios',)
				if request.user.has_perms(perms):
					user = Usuarios.objects.get(username = request.POST.get('username'))
					groups =  user.groups.all()
					for x in groups:
						if "ENFERMERO/A COORDINADOR/A PAI" in x.name:
							data['error'] = "No puedes eliminar a este usuario"
							break
						else:
							user.delete()
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(UsuariosViews, self).get_context_data(**kwargs)
		return context

class CrearUsuarios(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name = 'usuarios/add_usuarios.html'
	permission_required = 'core.add_usuarios'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']

			if action == 'add_user':
				perms = ('core.add_usuarios',)
				if request.user.has_perms(perms):
					personal = Personal.objects.get(cedula = request.POST.get('personal'))
					if Usuarios.objects.filter(username = personal.cedula):
						data['error'] = "Ya existe un usuario registrado a este personal"
					else:
						user = Usuarios()
						user.username = personal.cedula
						user.first_name = personal.nombre
						user.last_name = personal.apellido
						user.email = personal.correo
						user.set_password(request.POST.get('password1'))
						user.save()

						user_new = Usuarios.objects.get(username = personal.cedula)
						for g in request.POST['groups']:
							user_new.groups.add(g)
						user_new.save()
			
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(CrearUsuarios, self).get_context_data(**kwargs)
		context['form'] = UserForm()
		context['personal'] = Personal.objects.filter(status='Activo', ocupacion__in = ['Administrativo', 'Medico', 'Enfermero'])
		return context

class RecuperarAcceso(TemplateView):
	template_name = "registration/reset_password.html"
	success_url = reverse_lazy("login")

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			if action == 'reset_password':

				user_error = request.POST['username']
				if not Usuarios.objects.filter(username = request.POST['username']):
					data['error'] = f'el usuario {user_error} no existe' 
					
				else:
					user = Usuarios.objects.get(username = request.POST['username'])
					per = Personal.objects.get(cedula = request.POST.get('username'))
					correo = per.correo
					tlf = per.movil
					if correo != request.POST.get('correo') or tlf != request.POST.get('tlf'):
						data['error'] = "Correo o telefono no coinciden con el registro del personal" 
					else:
						user.set_password(request.POST.get('password'))
						user.save()

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(RecuperarAcceso, self).get_context_data(**kwargs)
		return context
