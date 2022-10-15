from django.urls import path

from apps.core.views import Inicio
# vistas del personal
from apps.core.view.personal.views import EditarPersonal, DetallesPersonal, PersonalViews
# vistas de las vacunas 
from apps.core.view.vacunas.views import VacunasViews, EditarVacuna
# vistas de los reposos
from apps.core.view.reposos.views import RepososViews, EditarReposo, DetalleReposo
# vistas de los encargados
from apps.core.view.encargados.views import EncargadoViews, EditarEncargado, DetalleEncargados
# vistas de los establecimientos
from apps.core.view.establecimientos.views import EditarEstablecimiento, EstablecimientosViews

urlpatterns = [
    path('inicio/', Inicio.as_view(), name="inicio"),

    # URLS DEL PERSONAL
    path('listado-de-personal/', PersonalViews.as_view(), name="list_personal"),
    path('editar-personal/<int:pk>/', EditarPersonal.as_view(), name="edit_personal"),
    path('detalles-del-personal/<int:pk>/', DetallesPersonal.as_view(), name="detail_personal"),
    
    # URLS DE LAS VACUNAS
    path('listado-de-vacunas/', VacunasViews.as_view(), name="list_vacunas"),
    path('editar-vacunas/<slug:pk>/', EditarVacuna.as_view(), name="edit_vacunas"),

    # URLS DE REPOSOS
    path('listado-de-reposos/', RepososViews.as_view(), name="list_reposos"),
    path('editar-reposo/<slug:pk>/', EditarReposo.as_view(), name="edit_reposos"),
    path('detalle-del-reposo/<slug:pk>/', DetalleReposo.as_view(), name="detail_reposos"),

    # URLS DE ENCARGADOS
    path('listado-de-encargados/', EncargadoViews.as_view(), name="list_encargados"),
    path('editar-encargado/<slug:pk>/', EditarEncargado.as_view(), name="edit_encargados"),
    path('detalle-del-encargado/<slug:pk>/', DetalleEncargados.as_view(), name="detail_encargados"),

    # URLS DE LOS ESTABLECIMIENTOS
    path('listado-de-establecimientos/', EstablecimientosViews.as_view(), name="list_establecimientos"),
    path('editar-establecimientos/<slug:pk>/', EditarEstablecimiento.as_view(), name="edit_establecimientos"),
    
]
