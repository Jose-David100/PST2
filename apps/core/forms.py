from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from apps.core.models import *

class VacunasForm(ModelForm):
	class Meta:
		model = Vacunas
		fields = '__all__'

class ReposoForm(ModelForm):
	personal = forms.ModelChoiceField(queryset=Personal.objects.filter(status='Activo'))
	class Meta:
		model = Reposos
		fields = '__all__'

class PersonalForm(ModelForm):
	class Meta:
		model = Personal
		fields = '__all__'

class EstablecimientoForm(ModelForm):
	class Meta:
		model = Establecimiento
		fields = '__all__'

class EncargadosForm(ModelForm):
	class Meta:
		model = Encargado
		fields = '__all__'

class DetalleIngresoForm(ModelForm):
	class Meta:
		model = DetalleIngreso
		fields = '__all__'

class DetalleSalidaForm(ModelForm):
	class Meta:
		model = DetalleSalida
		fields = '__all__'

class SalidaForm(ModelForm):
	personal = forms.ModelChoiceField(queryset=Personal.objects.filter(status = 'Activo', ocupacion__in=['Medico', 'Enfermero'] ))
	class Meta:
		model = Salida
		fields = '__all__'

class RegisterForm(UserCreationForm):
	personal = forms.ModelChoiceField(queryset=Personal.objects.filter(status = 'Activo', ocupacion__in=['Medico', 'Enfermero', 'Administrativo'] ))
	model = User
	fields = ['first_name', 'last_name', 'email', 'username', 'password1', 'password2', 'personal', 'groups']

	def clean(self):
		cleaned_data = super(RegisterForm, self).clean()

		user_exists = (User.objects.filter(username = cleaned_data.get('username')).count() > 0)

		if user_exists:
			self.add_error('username', 'Un usuario ya esta registrado con esta cedula')