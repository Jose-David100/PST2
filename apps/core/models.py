from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import model_to_dict

# Create your models here.

sexo_choice = (
	('Masculino', 'Masculino'),
	('Femenino', 'Femenino'),
)
status_choice = (
	('Activo', 'Activo'),
	('Inactivo', 'Inactivo'),
)

status_reposo = (
	('Aprobado', 'Aprobado'),
	('Rechazado', 'Rechazado'),
)

ocupacion_choice = (
	('Administrativo', 'Administrativo'),
	('Enfermero', 'Enfermero'),
	('Medico', 'Medico'),
	('Obrero', 'Obrero'),
)

rol_choice = (
	('Administrador', 'Administrador del sistena'),
	('Enfermero/a coordinador/a PAI', 'Enfermero/a coordinador/a PAI'),
	('Coordinador/a de cuarto frio', 'Coordinador/a de cuarto frio'),
	('Coordinador/a de division estrategica', 'Coordinador/a de division estrategica'),
	('Transcriptor', 'Transcriptor'),
	('Sin acceso', 'Sin acceso'),
)

naci_choice = (
	('V', 'V-'),
	('E', 'E-'),
)


class Personal(models.Model):
	tipo_ci = models.CharField(max_length=10, choices=naci_choice ,null=False, blank=False)
	cedula = models.CharField(max_length=10, null=False, blank=False)
	nombre = models.CharField(max_length=50, null=False, blank=False)
	apellido = models.CharField(max_length=50, null=False, blank=False)
	fecha_nacimiento = models.DateField(null=False, blank=False)
	direccion = models.TextField(null=False, blank=False)
	movil = models.CharField(max_length=11, null=True, blank=True)
	correo = models.CharField(max_length=50, null=True, blank=True)
	ocupacion = models.CharField(max_length=50, choices=ocupacion_choice,null=False, blank=False)
	rol_sistema = models.CharField(max_length=50, choices=rol_choice,null=True, blank=True)
	sexo = models.CharField(max_length=20, choices=sexo_choice , null=False, blank=False)
	status = models.CharField(max_length=50,choices=status_choice ,null=False, blank=False)

	def __str__(self):
		return (str(self.cedula))

	def toJSON(self):
		item = model_to_dict(self)
		return item


class Reposos(models.Model):
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	motivo_reposo = models.TextField(null=False, blank=False)
	duracion = models.CharField(max_length=50, null=False, blank=False)
	fecha_inicio = models.DateField(null=False, blank=False)
	fecha_ingreso = models.DateField(null=False, blank=False)
	status = models.CharField(max_length=20, choices=status_reposo, null=False, blank=False )

	def __str__(self):
		return (str(self.id))

	def toJSON(self):
		item = model_to_dict(self)
		item['personal'] = {
			'id': self.personal.id,
			'ci': self.personal.cedula,
			'nombre': self.personal.nombre,
			'apellido': self.personal.apellido
		}
		return item

class Vacunas(models.Model):
	nombre = models.CharField(max_length=50, null=False, blank=False)
	presentacion = models.CharField(max_length=50, null=False, blank=False)
	existencia = models.IntegerField(null=False, blank=False)
	status = models.CharField(max_length=20, choices=status_choice ,null=False, blank=False)

	def __str__(self):
		return (str(self.nombre))

	def toJSON(self):
		item = model_to_dict(self)
		return item

class Ingreso(models.Model):
	fecha_ingreso = models.DateField(null=False, blank=False)
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	observacion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (str(self.id))

	def toJSON(self):
		item = model_to_dict(self)
		return item

class DetalleIngreso(models.Model):
	ingreso = models.ForeignKey(Ingreso, on_delete=models.CASCADE, null=False, blank=False)
	vacuna = models.ForeignKey(Vacunas, on_delete=models.CASCADE, null=False, blank=False)
	lote = models.CharField(max_length=50, null=False, blank=False)
	fecha_vencimiento = models.DateField(null=False, blank=False)
	cantidad_ingreso= models.IntegerField(null=False, blank=False)

	def __str__(self):
		return (str(self.id))

	def toJSON(self):
		item = model_to_dict(self)
		item['ingreso'] = {
			'id': self.ingreso.id,
			'fecha': self.ingreso.fecha_ingreso,
			'observacion': self.ingreso.observacion,
		}
		item['vacuna'] = {
			'id': self.vacuna.id,
			'nombre': self.vacuna.nombre,
			'presentacion': self.vacuna.presentacion,
			'existencia': self.vacuna.existencia,
		}
		return item


class Encargado(models.Model):
	cedula = models.CharField(max_length=10, null=False, blank=False)
	nombre = models.CharField(max_length=50,null=False, blank=False)
	apellido = models.CharField(max_length=50,null=False, blank=False)
	movil = models.CharField(max_length=11,null=True, blank=True)
	direccion = models.TextField(null=False, blank=False)
	correo = models.CharField(max_length=50,null=True, blank=True)
	funcion = models.CharField(max_length=50, choices=ocupacion_choice ,null=False, blank=False)

	def __str__(self):
		return (str(self.cedula))

	def toJSON(self):
		item = model_to_dict(self)
		return item

class Establecimiento(models.Model):
	nombre = models.CharField(max_length=150, null=False, blank=False, unique=True)
	direccion = models.TextField(null=False, blank=False)
	encargado = models.ForeignKey(Encargado, on_delete=models.CASCADE, null=False, blank=False)

	def __str__(self):
		return (str(self.nombre))

	def toJSON(self):
		item = model_to_dict(self)
		item['encargado'] = {
			'id': self.encargado.id,
			'ci': self.encargado.cedula,
			'nombre': self.encargado.nombre,
			'apellido': self.encargado.apellido
		}
		return item

class Salida(models.Model):
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE, null=False, blank=False)
	fecha_salida = models.DateField(null=False, blank=False)
	observacion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (str(self.id))

	def toJSON(self):
		item = model_to_dict(self)
		item['personal'] = {
			'cedula': self.personal.cedula,
		}
		item['establecimiento'] = {
			'nombre': self.establecimiento.nombre,
		}
		return item

class DetalleSalida(models.Model):
	salida = models.ForeignKey(Salida, on_delete=models.CASCADE, null=False, blank=False )
	vacuna = models.ForeignKey(Vacunas, on_delete=models.CASCADE, null=False, blank=False)
	cantidad = models.IntegerField(null=False, blank=False)
	lote = models.CharField(max_length=50, null=False, blank=False)
	fecha_vencimiento = models.DateField(null=False, blank=False)

	def __str__(self):
		return (str(self.id))

	def toJSON(self):
		item = model_to_dict(self)
		item['vacuna'] = {
			'id': self.vacuna.id,
			'nombre': self.vacuna.nombre,
			'presentacion': self.vacuna.presentacion,
		}
		item['salida'] = {
			'id': self.salida.id,
			'fecha': self.salida.fecha_salida,
			'ced_personal': self.salida.personal.cedula,
			'nom_personal': self.salida.personal.nombre,
			'ape_personal': self.salida.personal.apellido,
			'ocu_personal': self.salida.personal.ocupacion,
			'id_estable': self.salida.establecimiento.id,
			'nom_estable': self.salida.establecimiento.nombre,
		}
		return item

# MODELO DE LOS USUARIOS
class Usuarios(AbstractUser):

	def toJSON(self):
		item = model_to_dict(self)
		return item