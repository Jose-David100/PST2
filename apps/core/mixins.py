from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib import messages

class Perms_Check(object):
    permission_required = ''
    url_redirect = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['estado'] = 'error'
        return context
        
    def get_perms(self):
        if isinstance(self.permission_required, str):
            perms = (self.permission_required,)
        else:
            perms = self.permission_required
        return perms
    
    def get_url_rediret(self):
        if self.url_redirect is None:
            return reverse_lazy('inicio')
        return self.url_redirect
    
    def dispatch(self, request,*args, **kwargs):
        if request.user.has_perms(self.get_perms()):
            return super().dispatch(request, *args, **kwargs)
        messages.error(request, 'No tiene permisos para ingresar a este modulo')
        return redirect(self.get_url_rediret())