var tablaI;

// DATA DE ESTABLECIMIENTOS
function getDataI() {
	tablaI = $('#table').DataTable({
		responsive: true,
		autoWidth: false,
		destroy: true,
		deferRender: true,
		"language": {
			"sProcessing": "Procesando...",
			"sLengthMenu": "Mostrar _MENU_ registros",
			"sZeroRecords": "No se encontraron resultados",
			"sEmptyTable": "Ningún dato disponible en esta tabla",
			"sInfo": "Mostrando del _START_ al _END_ de un total de _TOTAL_ registros",
			"sInfoEmpty": "Mostrand del 0 al 0 de un total de 0 registros",
			"sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
			"sInfoPostFix": "",
			"sSearch": "Buscar:",
			"sUrl": "",
			"sInfoThousands": ",",
			"sLoadingRecords": "Cargando...",
			"oPaginate": {
				"sFirst": "<span class='fa fa-angle-double-left'></span>",
				"sLast": "<span class='fa fa-angle-double-right'></span>",
				"sNext": "<span class='fa fa-angle-right'></span>",
				"sPrevious": "<span class='fa fa-angle-left'></span>"
			},
			"oAria": {
				"sSortAscending": ": Activar para ordenar la columna de manera ascendente",
				"sSortDescending": ": Activar para ordenar la columna de manera descendente"
			}
		},
		ajax: {
			url: window.location.pathname,
			type: 'POST',
			data: {
				'action': 'listado_ingreso',
			},
			dataSrc: ""
		},
		columns: [{
			"data": "vacuna.nombre"
		}, {
			"data": "ingreso.observacion"
		}, {
			"data": "cantidad_ingreso"
		}, {
			"data": "ingreso.fecha"
		}, {
			"data": "ingreso.fecha"
		}],
		columnDefs: [{
			targets: [-1],
			class: 'text-center',
			orderable: false,
			render: function(data, type, row) {

				var buttons = '<a href="#" rel="detail" class="btn btn-icon btn-dark"><i class="fas fa-info"></i></a> ';
				buttons += '<a href="#" rel="edit" class="btn btn-icon btn-dark"><i class="fas fa-edit"></i></a> ';
				return buttons;
			}

		}, {
			targets: [1],
			class: '',
			orderable: true,
			render: function(data, type, row) {
				if ((data.length) > 30) {
					data = data.slice(0, 30) + '...'
				}
				data
				return data
			}

		}, ],
		initComplete: function(settings, json) {

		}
	});
};
$(function() {
	getDataI();
});

// DATERANGEPICKER MODAL
$(function() {
	var fecha = new Date();
	var anno = fecha.getFullYear();
	$('.fecha-modal').daterangepicker({
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

// SELECT2 PARA MODALES
$(document).ready(function() {
	$("#id_vacuna").select2({
		dropdownParent: $("#Registrar_ingreso"),
		placeholder: 'Seleccione la Vacuna',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
});

// BOTONES PARA LOS MODALES
function abrir_modal_ingreso() {
	$("#Registrar_ingreso").modal("show");
	modal_title.html('Registrar ingreso de Vacuna');
	//$("#id_vacuna").val(null).trigger('change');
	$('input[name="cantidad_ingreso"]').removeAttr('readonly');
}

function cerrar_modal_ingreso() {
	$("#Registrar_ingreso").modal("hide");
	$("#form_ingreso")[0].reset();
	$("#id_vacuna").val(null).trigger('change');
	$("#id_vacuna").removeAttr('disabled');
}

function cerrar_modal_detalle() {
	$("#Detalles_ingreso").modal("hide");
}
// REGISTRAR PERSONAL
/* FORM SUBMIT AJAX*/
$('#form_ingreso').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_ingreso").modal('hide');
		$("#form_ingreso")[0].reset();
		toastr.success('Se ha registrado correctamente');
		getDataI();
	});
});

$(function() {
	// EDICION DE LOS INGRESOS
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Ingreso');
		var tr = tablaI.cell($(this).closest('td, li')).index();
		var data = tablaI.row(tr.row).data();
		$('input[name="action"]').val('editar_ingreso');
		$('input[name="id_detalle"]').val(data.id);
		$('input[name="id_ingreso"]').val(data.ingreso.id);

		$("#id_vacuna").attr('disabled', 'disabled');
		$('input[name="cantidad_ingreso"]').attr('readonly', '');

		$('select[name="vacuna"]').val(data.vacuna.id);
		$('select[name="vacuna"]').change();
		$('input[name="fecha_ingreso"]').val(data.ingreso.fecha);
		$('input[name="cantidad_ingreso"]').val(data.cantidad_ingreso);
		$('textarea[name="observacion"]').val(data.ingreso.observacion);

		$("#Registrar_ingreso").modal('show');
	});

	// DETALLES DE LAS INGRESOS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaI.cell($(this).closest('td, li')).index();
		var data = tablaI.row(tr.row).data();
		$("#Detalles_ingreso").modal('show');

		$('#nom').text(data.vacuna.nombre);
		$('#ing').text(data.cantidad_ingreso);
		$('#fec').text(data.ingreso.fecha);
		$('#obs').text(data.ingreso.observacion);
	});
});