from django.urls import path

from apps.core.views import Inicio
# vistas del personal
from apps.core.view.personal.views import ListadoPersonal, RegistrarPersonal, EditarPersonal, DetallesPersonal
# vistas de las vacunas 
from apps.core.view.vacunas.views import ListadoVacunas, RegistrarVacunas, EditarVacuna
# vistas de los reposos
from apps.core.view.reposos.views import ListadoReposos, RegistrarReposo, EditarReposo, DetalleReposo
# vistas de los encargados
from apps.core.view.encargados.views import ListadoEncargados, RegistrarEncargado, EditarEncargado, DetalleEncargados
# vistas de los establecimientos
from apps.core.view.establecimientos.views import ListadoEstablecimiento, RegistrarEstablecimiento, EditarEstablecimiento

urlpatterns = [
    path('inicio/', Inicio.as_view(), name="inicio"),

    # URLS DEL PERSONAL
    path('listado-de-personal/', ListadoPersonal.as_view(), name="list_personal"),
    path('registrar-personal/', RegistrarPersonal.as_view(), name="register_personal"),
    path('editar-personal/<int:pk>/', EditarPersonal.as_view(), name="edit_personal"),
    path('detalles-del-personal/<int:pk>/', DetallesPersonal.as_view(), name="detail_personal"),
    
    # URLS DE LAS VACUNAS
    path('listado-de-vacunas/', ListadoVacunas.as_view(), name="list_vacunas"),
    path('registrar-vacunas/', RegistrarVacunas.as_view(), name="register_vacunas"),
    path('editar-vacunas/<slug:pk>/', EditarVacuna.as_view(), name="edit_vacunas"),

    # URLS DE REPOSOS
    path('listado-de-reposos/', ListadoReposos.as_view(), name="list_reposos"),
    path('registrar-reposo/', RegistrarReposo.as_view(), name="register_reposo"),
    path('editar-reposo/<slug:pk>/', EditarReposo.as_view(), name="edit_reposos"),
    path('detalle-del-reposo/<slug:pk>/', DetalleReposo.as_view(), name="detail_reposos"),

    # URLS DE ENCARGADOS
    path('listado-de-encargados/', ListadoEncargados.as_view(), name="list_encargados"),
    path('registrar-encargado/', RegistrarEncargado.as_view(), name="register_encargado"),
    path('editar-encargado/<slug:pk>/', EditarEncargado.as_view(), name="edit_encargados"),
    path('detalle-del-encargado/<slug:pk>/', DetalleEncargados.as_view(), name="detail_encargados"),

    # URLS DE LOS ESTABLECIMIENTOS
    path('listado-de-establecimientos/', ListadoEstablecimiento.as_view(), name="list_establecimientos"),
    path('registrar-establecimientos/', RegistrarEstablecimiento.as_view(), name="register_establecimientos"),
    path('editar-establecimientos/<slug:pk>/', EditarEstablecimiento.as_view(), name="edit_establecimientos"),
    
]
