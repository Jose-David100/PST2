import sys
import tempfile
import os
import json

from django.shortcuts import  redirect, HttpResponse
from django.views.generic import TemplateView, View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.core.mixins import Perms_Check
from django.urls import reverse_lazy
from datetime import datetime
from django.contrib.auth import authenticate

# IMPORTACIONES PARA EJECUTAR COMANDOS SHELL DESDE LA PROGRAMACIÓN
from django.core import management
from django.core.management.commands import loaddata

class RespaldoDB(LoginRequiredMixin, Perms_Check, TemplateView):
	template_name = "respaldo_bd/RespaldoDB.html"
	permission_required = 'core.add_usuarios'

	def post(self, request, *args, **kwargs):
		data = {}
		try:
			action = request.POST.get('action')
			
			if action == 'validar_datos_administrador':
				username = request.POST['username']
				pass_actual = request.POST['password1']
				user = authenticate(request, username=username, password=pass_actual)
				if user is not None:
					return redirect('respaldar_db')
				else:
					data['error'] = "CONTRASEÑA INCORRECTA" 

			elif action == 'restaurar_db':
				archivo = request.FILES['upload_db']
				username = request.POST['username']
				pass_actual = request.POST['password1']
				user = authenticate(request, username=username, password=pass_actual)

				if user is not None:

					with open('data.json', 'wb+') as file:
						for chunk in archivo.chunks():
							file.write(chunk)
							
					management.call_command('loaddata', 'data.json', verbosity=0)

					os.remove('data.json')
				else:
					data['error'] = "CONTRASEÑA INCORRECTA" 
			
			else:
				data['error'] = 'Ha ocurrido un error'           

		except Exception as e:
			data['error'] = str(e)
		return JsonResponse(data, safe=False)
	
	def get_context_data(self, **kwargs):
		context = super(RespaldoDB, self).get_context_data(**kwargs)
		return context

class RespaldarBD(LoginRequiredMixin, Perms_Check, View):
	permission_required = 'core.add_usuarios'

	def get(self, request, *args, **kwargs):

		sysout = sys.stdout
		response = HttpResponse(content_type='application/json')
		response['Content-Disposition'] = f'attachment; filename=database[{datetime.now()}].json'
		
		sys.stdout = response
		management.call_command('dumpdata', indent=4)
		sys.stdout = sysout
		return response