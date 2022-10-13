from django.db import models

# Create your models here.

sexo_choice = (
	('masculino', 'Masculino'),
	('femenino', 'Femenino'),
)

class Personal(models.Model):
	cedula = models.CharField(max_length=10, primary_key=True, null=False, blank=False)
	nombre = models.CharField(max_length=50, null=False, blank=False)
	apellido = models.CharField(max_length=50, null=False, blank=False)
	direccion = models.TextField(null=False, blank=False)
	movil = models.CharField(max_length=11, null=True, blank=True)
	ocupacion = models.CharField(max_length=50, null=False, blank=False)
	sexo = models.CharField(max_length=20, choices=sexo_choice , null=False, blank=False)
	status = models.CharField(max_length=50, null=False, blank=False)

	def __str__(self):
		return (self.cedula)

class TipoReposo(models.Model):
	tipo_reposo = models.CharField(max_length=50, null=False, blank=False)
	observacion = models.TextField(null=True, blank=True)

	def __str__(self):
		return (self.tipo_reposo)

class Reposos(models.Model):
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	tipo_reposo = models.ForeignKey(TipoReposo, on_delete=models.CASCADE, null=False, blank=False)
	motivo_reposo = models.CharField(max_length=50, null=False, blank=False)
	duracion = models.CharField(max_length=50, null=False, blank=False)
	fecha_inicio = models.DateField(null=False, blank=False)

	def __str__(self):
		return (self.id)

class Vacunas(models.Model):
	nombre = models.CharField(max_length=50, null=False, blank=False)
	presentacion = models.CharField(max_length=50, null=False, blank=False)
	existencia = models.IntegerField(null=False, blank=False)

	def __str__(self):
		return (self.nombre)

class Ingreso(models.Model):
	fecha_ingreso = models.DateField(null=False, blank=False)
	observacion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (self.id)

class DetalleIngreso(models.Model):
	ingreso = models.ForeignKey(Ingreso, on_delete=models.CASCADE, null=False, blank=False)
	vacuna = models.ForeignKey(Vacunas, on_delete=models.CASCADE, null=False, blank=False)
	cantidad_ingreso= models.IntegerField(null=False, blank=False)

	def __str__(self):
		return (self.id)


class Encargado(models.Model):
	cedula = models.CharField(max_length=10, primary_key=True, null=False, blank=False)
	nombre = models.CharField(max_length=50,null=False, blank=False)
	apellido = models.CharField(max_length=50,null=False, blank=False)
	movil = models.CharField(max_length=11,null=True, blank=True)
	direccion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (self.cedula)

class Establecimiento(models.Model):
	nombre = models.CharField(max_length=150,null=False, blank=False)
	direccion = models.TextField(null=False, blank=False)
	encargado = models.ForeignKey(Encargado, on_delete=models.CASCADE, null=False, blank=False)

	def __str__(self):
		return (self.nombre)

class Salida(models.Model):
	personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=False, blank=False)
	establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE, null=False, blank=False)
	fecha_salida = models.DateField(null=False, blank=False)

	def __str__(self):
		return (self.id)

class DetalleSalida(models.Model):
	salida = models.ForeignKey(Salida, on_delete=models.CASCADE, null=False, blank=False )
	vacuna = models.ForeignKey(Vacunas, on_delete=models.CASCADE, null=False, blank=False)
	cantidad = models.IntegerField(null=False, blank=False)
	observacion = models.TextField(null=False, blank=False)

	def __str__(self):
		return (self.id)
