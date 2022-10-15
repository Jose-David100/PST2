var tablaE;

// DATA DE ESTABLECIMIENTOS
function getDataE() {
	tablaE = $('#table').DataTable({
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
				'action': 'listado_establecimiento',
			},
			dataSrc: ""
		},
		columns: [{
			"data": "nombre"
		}, {
			"data": "direccion"
		}, {
			"data": "encargado.ci"
		}, {
			"data": "encargado.nombre"
		}, {
			"data": "encargado.apellido"
		}, {
			"data": "nombre"
		}],
		columnDefs: [{
			targets: [-1],
			class: 'text-center',
			orderable: false,
			render: function(data, type, row) {

				var buttons = '<a href="#" rel="detail" class="btn btn-icon btn-dark"><i class="fas fa-info"></i></a> ';
				buttons += '<a href="#" rel="edit" class="btn btn-icon btn-dark"><i class="fas fa-edit"></i></a> ';
				buttons += '<a href="#" rel="delete" class="btn btn-icon btn-dark"><i class="fas fa-trash"></i></a> ';
				return buttons;
			}

		}, {
			targets: [1],
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
	getDataE();
});

// SELECT2 PARA MODALES
$(document).ready(function() {
	$("#id_encargado").select2({
		dropdownParent: $("#Registrar_establecimiento"),
		placeholder: 'Seleccione el encargado',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
});

// BOTONES PARA LOS MODALES
function abrir_modal_establecimiento() {
	$("#Registrar_establecimiento").modal("show");
}

function cerrar_modal_establecimiento() {
	$("#Registrar_establecimiento").modal("hide");
	$("#Form_establecimiento")[0].reset();
	$('#id_encargado').val(null).trigger('change');

}

// REGISTRAR ESTABLECIMIENTO
/* FORM SUBMIT AJAX*/
$('#Form_establecimiento').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notifiación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_establecimiento").modal('hide');
		$("#Form_establecimiento")[0].reset();
		$('#id_encargado').val(null).trigger('change');
		toastr.success('Se ha registrado el establecimiento correctamente');
		getDataE();
	});
});