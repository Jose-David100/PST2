// RESTABLECER LA CONTRASEÑA DESDE EL LOGIN
/* FORM SUBMIT AJAX*/
$('#form_reset').on('submit', function(e) {
	e.preventDefault();
    if($("#id_password1").val() !== $("#id_password2").val() ){
        toastr.warning('Las nuevas contraseñas no coinciden');
        $("#id_password1").focus();
    }else{
        var parameters = new FormData(this);
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
            toastr.success('Se ha restablecido correctamente');
            window.location.replace('/accounts/login/');
        });
    }
});