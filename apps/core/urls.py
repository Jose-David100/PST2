from django.urls import path

from apps.core.views import Inicio
# vistas del personal
from apps.core.view.personal.views import PersonalViews
# vistas de las vacunas 
from apps.core.view.vacunas.views import VacunasViews
# vistas de los reposos
from apps.core.view.reposos.views import RepososViews
# vistas de los encargados
from apps.core.view.encargados.views import EncargadoViews
# vistas de los establecimientos
from apps.core.view.establecimientos.views import EstablecimientosViews

urlpatterns = [
    path('inicio/', Inicio.as_view(), name="inicio"),

    # URLS DEL PERSONAL
    path('listado-de-personal/', PersonalViews.as_view(), name="list_personal"),
    
    # URLS DE LAS VACUNAS
    path('listado-de-vacunas/', VacunasViews.as_view(), name="list_vacunas"),

    # URLS DE REPOSOS
    path('listado-de-reposos/', RepososViews.as_view(), name="list_reposos"),

    # URLS DE ENCARGADOS
    path('listado-de-encargados/', EncargadoViews.as_view(), name="list_encargados"),

    # URLS DE LOS ESTABLECIMIENTOS
    path('listado-de-establecimientos/', EstablecimientosViews.as_view(), name="list_establecimientos"),
    
]
