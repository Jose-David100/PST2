var tablaR;

// DATA DE ESTABLECIMIENTOS
function getDataR() {
	tablaR = $('#table').DataTable({
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
				'action': 'listado_reposos',
			},
			dataSrc: ""
		},
		columns: [{
			"data": "personal.ci"
		}, {
			"data": "personal.nombre"
		}, {
			"data": "personal.apellido"
		}, {
			"data": "motivo_reposo"
		}, {
			"data": "duracion"
		}, {
			"data": "fecha_inicio"
		},{
			"data": "fecha_ingreso"
		}, {
			"data": "status"
		}, {
			"data": "fecha_inicio"
		}],
		columnDefs: [{
			targets: [-1],
			class: 'text-center',
			orderable: false,
			render: function(data, type, row) {
				var buttons = '<a href="#" rel="detail" class="btn btn-icon btn-dark"><i class="fas fa-info"></i></a> ';

				if (row['status'] == 'Rechazado'){
					buttons += '<a href="#" rel="edit" class="btn btn-icon btn-dark"><i class="fas fa-edit"></i></a> ';
				}
				
				return buttons;
			}

		}, {
			targets: [3],
			class: '',
			orderable: true,
			render: function(data, type, row) {
				if ((data.length) > 20) {
					data = data.slice(0, 20) + '...'
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
	getDataR();
});

$(function() {
	// daterangepicker
	var fecha = new Date();
	var anno = fecha.getFullYear();
	$('#id_fecha_inicio').daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		minYear: 1901,
		maxDate: fecha,
		maxYear: anno,
		drops: 'up',
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
	$("#id_personal").select2({
		dropdownParent: $("#Registrar_reposos"),
		placeholder: 'Seleccione el solicitante',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
});

// BOTONES PARA LOS MODALES
function abrir_modal_reposos() {
	$("#Registrar_reposos").modal("show");
	modal_title.html('Registrar Reposo');
}

function cerrar_modal_reposos() {
	$("#Registrar_reposos").modal("hide");
	$("#form_reposos")[0].reset();
	$('#id_personal').val(null).trigger('change');
	$("#id_personal").removeAttr('disabled');

}

function cerrar_modal_detalle() {
	$("#Detalles_reposo").modal("hide");
}

// REGISTRAR REPOSOS
/* FORM SUBMIT AJAX*/
$('#form_reposos').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_reposos").modal('hide');
		$("#form_reposos")[0].reset();
		$('#id_personal').val(null).trigger('change');
		toastr.success('Se ha registrado correctamente');
		window.location.replace('/listado-de-reposos/');
		getDataR();
	});
});

$(function() {
	// EDICION DE LOS REPOSOS
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Reposo');
		var tr = tablaR.cell($(this).closest('td, li')).index();
		var data = tablaR.row(tr.row).data();

		$('#id_personal').attr('disabled', 'disabled');

		$('select[name="personal"]').val(data.personal.id);
		$('input[name="action"]').val('editar_reposo');
		$('input[name="id"]').val(data.id);
		$('textarea[name="motivo_reposo"]').val(data.motivo_reposo);
		$('input[name="duracion"]').val(data.duracion);
		$('input[name="fecha_inicio"]').val(data.fecha_inicio);
		$('select[name="status"]').val(data.status);
		$("#id_personal").val(data.personal.id);
		$("#id_personal").change();
		$("#Registrar_reposos").modal('show');
	});

	// DETALLES DE LOS REPOSOS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaR.cell($(this).closest('td, li')).index();
		var data = tablaR.row(tr.row).data();
		$("#Detalles_reposo").modal('show');

		$('#ci').text(data.personal.ci);
		$('#nom').text(data.personal.nombre);
		$('#ape').text(data.personal.apellido);
		$('#mot').text(data.motivo_reposo);
		$('#dur').text(data.duracion);
		$('#fec').text(data.fecha_inicio);
		$('#fec_in').text(data.fecha_ingreso);
		$('#est').text(data.status);
	});
});