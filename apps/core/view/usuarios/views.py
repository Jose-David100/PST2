from apps.core.models import Personal
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, CreateView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse_lazy
from apps.core.mixins import Perms_Check

# IMPORTACIONES DE LOS MODELS Y FORMULARIOS
from django.contrib.auth.models import User
from apps.core.forms import RegisterForm

# USUARIOS 

class UsuariosViews(LoginRequiredMixin,Perms_Check, TemplateView):
	template_name = 'usuarios/Usuarios_list.html'
	permission_required = 'core.view_user'

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

class RegistrarUsuario(LoginRequiredMixin, Perms_Check,  SuccessMessageMixin, CreateView):
	model = User
	template_name = 'usuarios/add_usuarios.html'
	form_class = RegisterForm
	success_url = reverse_lazy('list_usuarios')
	success_message = 'Usuario registrado correctamente'
	initial = {'key': 'value'}
	permission_required = 'core.add_user'

	def get(self, request, *args, **kwargs):
		form = self.form_class(initial=self.initial)
		return render(request, self.template_name, {'form': form})

	def post(self, request, *args, **kwargs):
		perms = ('core.add_user',)
		if request.user.has_perms(perms):
			form = self.form_class(request.POST)
			if form.is_valid():
				personal = Personal.objects.get(id = request.POST.get('personal'))
				usuario = User()
				usuario.username = personal.cedula
				usuario.first_name = personal.nombre
				usuario.last_name = personal.apellido
				usuario.email = personal.correo
				usuario.password = request.POST.get('password')
				usuario.save()

				user_new = User.objects.get(username = personal.cedula)

				for g in form.cleaned_data['groups']:
						user_new.groups.add(g)
				user_new.save()
			
			return redirect('list_usuarios')

			return render(request, self.template_name, {'form': form})
	