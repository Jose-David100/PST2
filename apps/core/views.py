from django.views.generic import TemplateView
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from apps.core.models import Usuarios
from django.contrib.auth import authenticate, logout
# Create your views here.

class Inicio(LoginRequiredMixin, TemplateView):
	template_name = 'inicio.html'
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super().dispatch(request, *args, **kwargs)

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST['action']
			
			if action == 'cambiar_pass':
				username = request.POST['username']
				pass_actual = request.POST['password_actual']

				user = authenticate(request, username=username, password=pass_actual)
				if user is not None:
					user_done = Usuarios.objects.get(username= username)
					new_password = request.POST['password1']
					user_done.set_password(new_password)
					user_done.save()
					
					logout(request)
					data['success'] = "Contraseña actualizada correctamente"
					
				else:
					data['error'] = "La contraseña que ingreso no coincide con la contraseña actual" 
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)

	def get_context_data(self, **kwargs):
		context = super(Inicio, self).get_context_data(**kwargs)
		return context