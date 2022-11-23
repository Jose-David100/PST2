// DATERANGEPICKER MODAL
$(function() {
	var fecha = new Date();
	var anno = fecha.getFullYear();
	$('.fecha').daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		minYear: 1901,
		maxDate: fecha,
		maxYear: anno,
		"locale": {
			"format": "YYYY-MM-DD",
			"separator": " - ",
			"applyLabel": "Aplicar",
			"cancelLabel": "Cancelar",
			"fromLabel": "De",
			"toLabel": "a",
			"customRangeLabel": "Custom",
			"daysOfWeek": [
				"Do",
				"Lu",
				"Ma",
				"Mi",
				"Ju",
				"Vi",
				"Sa"
			],
			"monthNames": [
				"Enero",
				"Febrero",
				"Marzo",
				"Abril",
				"Mayo",
				"Junio",
				"Julio",
				"Agosto",
				"Septiembre",
				"Octubre",
				"Noviembre",
				"Deciembre"
			],
			"firstDay": 1
		}
	});
	
});

// REGISTRAR PERSONAL
/* FORM SUBMIT AJAX*/
$('#form_personal').on('submit', function(e) {
	e.preventDefault();
	function calcularEdad(fecha_nacimiento) {
		var hoy = new Date();
		var cumpleanos = new Date(fecha_nacimiento);
		var edad = hoy.getFullYear() - cumpleanos.getFullYear();
		var m = hoy.getMonth() - cumpleanos.getMonth();
		if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
			edad--;
		}
		return edad;
	}
	
	var edad = calcularEdad($("#id_fecha_nacimiento").val());
	if(edad < 18){
		toastr.warning('El personal debe ser mayor de edad');
	}else{
		var parameters = new FormData(this);
		submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			$("#Registrar_personal").modal('hide');
			$("#form_personal")[0].reset();
			toastr.success('Se ha registrado el Personal correctamente');
			window.location.replace("/listado-de-personal/");
			$('input[name="id"]').val(0);
			$('input[name="action"]').val('agregar_personal');
			$('input[name="cedula"]').removeAttr('readonly');
			$('input[name="nombre"]').removeAttr('readonly');
			$('input[name="apellido"]').removeAttr('readonly');
			$('select[name="sexo"]').removeAttr('disabled');
			$('select[name="ocupacion"]').removeAttr('disabled');
            
		});
	}
	
});