// BOTONES DE ABRIR Y CERRAR EL MODAL

function abrir_modal_verificacion() {
	$("#ModalConfirmacion").modal("show");
	$("#password1").focus();
	$("#password1").val('');
	$("#password2").val('');
}

function cerrar_modal_verificacion() {
	$("#ModalConfirmacion").modal("hide");
	$("#password1").val('');
	$("#password2").val('');
}

// BOTONES PARA ABRIR EL MODAL DEL FORMULARIO DE RESTABLECIMIENTO
function abrir_modal_upload() {
	$("#ModalConfirmacion_upload").modal("show");
	$("#password1").focus();
	$("#password1").val('');
	$("#password2").val('');
	$("#upload_file").val('');
}

function cerrar_modal_upload() {
	$("#ModalConfirmacion_upload").modal("hide");
	$("#password1").val('');
	$("#password2").val('');
	$("#upload_file").val('');
}


// ENVIO DEL FORMULARIO CO AJAX
$('#form_verificacion').on('submit', function(e) {
	e.preventDefault();
	if ($("#password1").val() !== $("#password2").val()) {
		toastr.warning('Las contraseñas no coinciden, intenta nuevamente');
		$("#password1").val('');
		$("#password2").val('');
		$("#password1").focus();
	} else {
		var parameters = new FormData(this);
		submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			$("#ModalConfirmacion").modal('hide');
			toastr.success('AUTENTICACIÓN EXITOSA, DESCARGANDO BASE DE DATOS');
			window.open('/respaldar-base-datos/');
		});
	}

});

// SUBIR LA BASE DE DATOS
$('#form_verificacion_upload').on('submit', async function(e) {
	e.preventDefault();
	if ($("#upload_file").val() == null || $("#upload_file").val() == '') {
		toastr.warning('Se debe seleccionar el archivo de la base de datos');
	} else {
		var parameters = new FormData(this);
		parameters.append('action', 'restaurar_db');
		submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			toastr.success('AUTENTICACIÓN EXITOSA, RESTAURANDO BASE DE DATOS');
			window.location.replace('/inicio/');
		});
	}

});