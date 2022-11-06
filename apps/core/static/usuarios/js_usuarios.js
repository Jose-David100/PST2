// REGISTRAR USUARIO
/* FORM SUBMIT AJAX*/
$('#user_form').on('submit', function(e) {
	e.preventDefault();
	if($('#id_password1').val() !== $('#id_password2').val() ){
		toastr.warning('Las contraseñas no coinciden');
	}else{
		var parameters = new FormData(this);
		submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			$("#user_form")[0].reset();
			toastr.success('Se ha registrado correctamente');
			window.location.replace('/listado-de-usuarios/');
		});
	}
	
});