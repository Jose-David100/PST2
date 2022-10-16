from django import forms
from django.forms import ModelForm
from apps.core.models import Vacunas, Reposos, Personal, Establecimiento, Encargado, DetalleIngreso

class VacunasForm(ModelForm):
	class Meta:
		model = Vacunas
		fields = '__all__'

class ReposoForm(ModelForm):
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