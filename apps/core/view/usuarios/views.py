from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
from datetime import timedelta, date, datetime

# IMPORTACIONES DE LOS MODELS Y FORMULARIOS
from django.contrib.auth.models import User
from apps.core.forms import RegisterForm

# USUARIOS 
class UsuariosViews(LoginRequiredMixin, TemplateView):
	template_name =  'usuarios/Usuarios_list.html'

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			if action == 'listado_usuarios':
				data = []
				for i in User.objects.all():
					data.append(i.toJSON())

			elif action == 'agregar_reposos':
				pass

			elif action == 'editar_reposo':	
				pass

			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(UsuariosViews, self).get_context_data(**kwargs)
		return context

class UsuariosViews(LoginRequiredMixin, TemplateView):
	template_name = 'usuarios/Usuarios_list.html'

	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def get(self, request, *args, **kwargs):
		data = {}
		try:
			
			obj = User.objects.all()

		except Exception as e:
			data['error'] = str(e)

		return render(request, self.template_name, {'obj': obj})

	def get_context_data(self, **kwargs):
		context = super(UsuariosViews, self).get_context_data(**kwargs)
		return context

class RegistrarUsuario(LoginRequiredMixin, SuccessMessageMixin, TemplateView):
	template_name = 'usuarios/add_usuarios.html'
	form_class = RegisterForm
	success_message = 'Usuario registrado correctamente'
	initial = {'key': 'value'}

	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def get(self, request, *args, **kwargs):
		form = self.form_class(initial=self.initial)
		return render(request, self.template_name, {'form': form})

	def post(self, request, *args, **kwargs):

		form = self.form_class(request.POST)
		
		if form.is_valid():
			user = form.save()
			user.refresh_from_db()

			user_m = User.objects.get(username = request.POST['username'])

			for g in form.cleaned_data['groups']:
				user_m.groups.add(g)
				perm = str(g)
				if perm == 'SIN PERMISOS':
					user_m.is_active = False

			user_m.save()

			return redirect('core:usuarios')

		return render(request, self.template_name, {'form': form})