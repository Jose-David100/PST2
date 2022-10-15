from django.db import models
from django.forms import model_to_dict

# Create your models here.

sexo_choice = (
	('masculino', 'Masculino'),
	('femenino', 'Femenino'),
)
status_choice = (
	('Activo', 'Activo'),
	('Inactivo', 'Inactivo'),
)

class Personal(models.Model):
	cedula = models.CharField(max_length=10, primary_key=True, null=False, blank=False)
	nombre = models.CharField(max_length=50, null=False, blank=False)
	apellido = models.CharField(max_length=50, null=False, blank=False)
	direccion = models.TextField(null=False, blank=False)
	movil = models.CharField(max_length=11, null=True, blank=True)
	ocupacion = models.CharField(max_length=50, null=False, blank=False)
	sexo = models.CharField(max_length=20, choices=sexo_choice , null=False, blank=False)
	status = models.CharField(max_length=50,choices=status_choice ,null=False, blank=False)

	def __str__(self):
		return (self.cedula)

	def toJSON(self):
		item = model_to_dict(self)
		return item


class Reposos(models.Model):
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	motivo_reposo = models.TextField(null=False, blank=False)
	duracion = models.CharField(max_length=50, null=False, blank=False)
	fecha_inicio = models.DateField(null=False, blank=False)

	def __str__(self):
		return (self.id)

	def toJSON(self):
		item = model_to_dict(self)
		item['personal'] = {
			'ci': self.personal.cedula,
			'nombre': self.personal.nombre,
			'apellido': self.personal.apellido
		}
		return item

class Vacunas(models.Model):
	nombre = models.CharField(max_length=50, null=False, blank=False)
	presentacion = models.CharField(max_length=50, null=False, blank=False)
	existencia = models.IntegerField(null=False, blank=False)

	def __str__(self):
		return (self.nombre)

	def toJSON(self):
		item = model_to_dict(self)
		return item

class Ingreso(models.Model):
	fecha_ingreso = models.DateField(null=False, blank=False)
	observacion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (self.id)

	def toJSON(self):
		item = model_to_dict(self)
		return item

class DetalleIngreso(models.Model):
	ingreso = models.ForeignKey(Ingreso, on_delete=models.CASCADE, null=False, blank=False)
	vacuna = models.ForeignKey(Vacunas, on_delete=models.CASCADE, null=False, blank=False)
	cantidad_ingreso= models.IntegerField(null=False, blank=False)

	def __str__(self):
		return (self.id)

	def toJSON(self):
		item = model_to_dict(self)
		return item


class Encargado(models.Model):
	cedula = models.CharField(max_length=10, primary_key=True, null=False, blank=False)
	nombre = models.CharField(max_length=50,null=False, blank=False)
	apellido = models.CharField(max_length=50,null=False, blank=False)
	movil = models.CharField(max_length=11,null=True, blank=True)
	direccion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (self.cedula)

	def toJSON(self):
		item = model_to_dict(self)
		return item

class Establecimiento(models.Model):
	nombre = models.CharField(max_length=150,null=False, blank=False)
	direccion = models.TextField(null=False, blank=False)
	encargado = models.ForeignKey(Encargado, on_delete=models.CASCADE, null=False, blank=False)

	def __str__(self):
		return (self.nombre)

	def toJSON(self):
		item = model_to_dict(self)
		item['encargado'] = {
			'ci': self.encargado.cedula,
			'nombre': self.encargado.nombre,
			'apellido': self.encargado.apellido
		}
		return item

class Salida(models.Model):
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE, null=False, blank=False)
	fecha_salida = models.DateField(null=False, blank=False)

	def __str__(self):
		return (self.id)

	def toJSON(self):
		item = model_to_dict(self)
		return item

class DetalleSalida(models.Model):
	salida = models.ForeignKey(Salida, on_delete=models.CASCADE, null=False, blank=False )
	vacuna = models.ForeignKey(Vacunas, on_delete=models.CASCADE, null=False, blank=False)
	cantidad = models.IntegerField(null=False, blank=False)
	observacion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (self.id)

	def toJSON(self):
		item = model_to_dict(self)
		return item
