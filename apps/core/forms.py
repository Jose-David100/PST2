from django import forms
from apps.core.models import Vacunas, Reposos, Personal, Establecimiento, Encargado

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

