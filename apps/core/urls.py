from django.urls import path

from apps.core.views import Inicio


urlpatterns = [
    path('inicio/', Inicio.as_view(), name="inicio"),
]
