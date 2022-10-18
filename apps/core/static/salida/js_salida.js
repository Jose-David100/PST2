var tablaS;

// DATA DE ESTABLECIMIENTOS
function getDataS() {
	tablaS = $('#table').DataTable({
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
				'action': 'listado_salida',
			},
			dataSrc: ""
		},
		columns: [{
			"data": "vacuna.nombre"
		}, {
			"data": "observacion"
		}, {
			"data": "cantidad"
		}, {
			"data": "salida.fecha"
		}, {
			"data": "salida.ced_personal"
		}, {
			"data": "salida.nom_estable"
		}, {
			"data": "salida.ced_personal"
		}, ],
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
	getDataS();
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
		dropdownParent: $("#Registrar_salida"),
		placeholder: 'Seleccione la Vacuna',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
	$("#id_personal").select2({
		dropdownParent: $("#Registrar_salida"),
		placeholder: 'Seleccione el Personal',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
	$("#id_establecimiento").select2({
		dropdownParent: $("#Registrar_salida"),
		placeholder: 'Seleccione el Establecimiento',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
});

// BOTONES PARA LOS MODALES
function abrir_modal_salida() {
	$("#Registrar_salida").modal("show");
	modal_title.html('Registrar salida de Vacuna');
	//$("#id_vacuna").val(null).trigger('change');
	$('input[name="cantidad_ingreso"]').removeAttr('readonly');
}

function cerrar_modal_salida() {
	$("#Registrar_salida").modal("hide");
	$("#form_salida")[0].reset();
	$("#id_vacuna").val(null).trigger('change');
	$("#id_vacuna").removeAttr('disabled');

	$("#id_personal").val(null).trigger('change');
	$("#id_personal").removeAttr('disabled');

	$("#id_establecimiento").val(null).trigger('change');
	$("#id_establecimiento").removeAttr('disabled');
}

function cerrar_modal_detalle() {
	$("#Detalles_ingreso").modal("hide");
}
// REGISTRAR PERSONAL
/* FORM SUBMIT AJAX*/
$('#form_salida').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_salida").modal('hide');
		$("#form_salida")[0].reset();
		toastr.success('Se ha registrado correctamente');
		getDataS();
	});
});

$(function() {
	// EDICION DE LAS SALIAS
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar salida de vacuna');
		var tr = tablaS.cell($(this).closest('td, li')).index();
		var data = tablaS.row(tr.row).data();
		$('input[name="action"]').val('editar_salida');
		$('input[name="id_detalle"]').val(data.id);
		$('input[name="id_salida"]').val(data.salida.id);

		$("#id_vacuna").attr('disabled', 'disabled');
		$('input[name="cantidad_ingreso"]').attr('readonly', '');

		$('select[name="vacuna"]').val(data.vacuna.id);
		$('select[name="vacuna"]').change();
		$('input[name="fecha_salida"]').val(data.salida.fecha);
		$('input[name="cantidad"]').val(data.cantidad);
		$('textarea[name="observacion"]').val(data.observacion);

		$('select[name="personal"]').val(data.salida.ced_personal);
		$('select[name="personal"]').change();

		$('select[name="establecimiento"]').val(data.salida.id_estable);
		$('select[name="establecimiento"]').change();

		$("#Registrar_salida").modal('show');
	});

	// DETALLES DE LAS SALIAS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaS.cell($(this).closest('td, li')).index();
		var data = tablaS.row(tr.row).data();
		$("#Detalles_ingreso").modal('show');

		$('#nom').text(data.vacuna.nombre);
		$('#ing').text(data.cantidad);
		$('#fec').text(data.salida.fecha);
		$('#obs').text(data.observacion);
		$('#ced_per').text(data.salida.ced_personal);
		$('#nom_per').text(data.salida.nom_personal);
		$('#ape_per').text(data.salida.ape_personal);
		$('#est_rec').text(data.salida.nom_estable);
		$('#ocu_per').text(data.salida.ocu_personal);
	});
});