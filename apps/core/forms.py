from django import forms
from django.forms import ModelForm
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
	personal = forms.ModelChoiceField(queryset=Personal.objects.filter(status = 'Activo', rol_sistema__in=['Enfermero/a coordinador/a PAI', 'Coordinador/a de cuarto frio', 'Coordinador/a de division estrategica']).exclude(rol_sistema = "Transcriptor"))
	class Meta:
		model = Salida
		fields = '__all__'

class UserForm(ModelForm):
	class Meta:
		model = Usuarios
		fields = ['groups']