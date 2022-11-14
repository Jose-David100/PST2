from django.urls import path

from apps.core.views import Inicio
# vistas del personal
from apps.core.view.personal.views import PersonalViews
# vistas de las vacunas 
from apps.core.view.vacunas.views import VacunasViews, MovimientosVacunas, SalidaVacunas, IngresoVacunas
# vistas de los reposos
from apps.core.view.reposos.views import RepososViews
# vistas de los encargados
from apps.core.view.encargados.views import EncargadoViews
# vistas de los establecimientos
from apps.core.view.establecimientos.views import EstablecimientosViews
# vistas de los ingresos de las vacunas
from apps.core.view.ingresos.views import IngresoViews, Ingresoform
# vista para las salidas de las vacunas
from apps.core.view.salida.views import SalidaViews, SalidasForm
# vista de los usuarios
from apps.core.view.usuarios.views import UsuariosViews, CrearUsuarios, RecuperarAcceso
# vistas para respaldar la base de datos
from apps.core.view.respaldo_bd.views import RespaldarBD, RespaldoDB

urlpatterns = [
    path('inicio/', Inicio.as_view(), name="inicio"),

    # URLS DEL PERSONAL
    path('listado-de-personal/', PersonalViews.as_view(), name="list_personal"),
    
    # URLS DE LAS VACUNAS
    path('listado-de-vacunas/', VacunasViews.as_view(), name="list_vacunas"),
    path('detalles-de-vacunas/', MovimientosVacunas.as_view(), name="detail_vacunas"),

    # URLS DE REPOSOS
    path('listado-de-reposos/', RepososViews.as_view(), name="list_reposos"),

    # URLS DE ENCARGADOS
    path('listado-de-encargados/', EncargadoViews.as_view(), name="list_encargados"),

    # URLS DE LOS ESTABLECIMIENTOS
    path('listado-de-establecimientos/', EstablecimientosViews.as_view(), name="list_establecimientos"),

    # URLS DE LOS INGRESOS DE LAS VACUNAS
    path('listado-de-ingresos-de-vacunas/', IngresoViews.as_view(), name="list_ingresos"),
    path('registro-de-ingresos-de-vacunas/', Ingresoform.as_view(), name="new_ingresos"),

    # URLS DE LOS SALIDAS DE LAS VACUNAS
    path('listado-de-salidas-de-vacunas/', SalidaViews.as_view(), name="list_salida"),
    path('registro-de-salidas-de-vacunas/', SalidasForm.as_view(), name="add_salida"),

    # URLS DE LOS USUARIOS
    path('listado-de-usuarios/', UsuariosViews.as_view(), name="list_usuarios"),
    path('registro-de-usuarios/', CrearUsuarios.as_view(), name="add_usuarios"),
    path('recuperacion-de-acceso/', RecuperarAcceso.as_view(), name="reset_password"),

    # RESPALDO DE LA BASE DE DATOS
    path('respaldo-del-sistema/', RespaldoDB.as_view(), name="respaldo_db"),
    path('respaldar-base-datos/', RespaldarBD.as_view(), name="respaldar_db"),
       
    # REPORTES
    path('reporte-de-salida-de-vacunas/<str:fecha1>/<str:fecha2>', SalidaVacunas, name="salida_report"),
    path('reporte-de-ingresos-de-vacunas/<str:fecha1>/<str:fecha2>', IngresoVacunas, name="ingreso_report"),
    
]
