var tablaE;
var modal_title;

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
				'action': 'listado_encargado',
			},
			dataSrc: ""
		},
		columns: [{
			"data": "cedula"
		}, {
			"data": "nombre"
		}, {
			"data": "apellido"
		}, {
			"data": "direccion"
		}, {
			"data": "movil"
		}, {
			"data": "movil"
		}],
		columnDefs: [{
			targets: [-1],
			class: 'text-center',
			orderable: false,
			render: function(data, type, row) {

				var buttons = '<a href="#" rel="detail" class="btn btn-icon btn-dark"><i class="fas fa-info"></i></a> ';
				buttons += '<a href="#" rel="edit" class="btn btn-icon btn-dark"><i class="fas fa-edit"></i></a> ';
				buttons += '<a href="#" rel="delete" class="btn btn-icon btn-dark delete"><i class="fas fa-trash"></i></a> ';
				return buttons;
			}

		}, {
			targets: [-3],
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

// BOTONES PARA LOS MODALES
function abrir_modal_encargado() {
	$("#Registrar_encargado").modal("show");
	$('input[name="cedula"]').removeAttr('readonly');
	$('input[name="nombre"]').removeAttr('readonly');
	$('input[name="apellido"]').removeAttr('readonly');
	modal_title.html('Registrar Encargado');
	$(".div").removeClass("delete");
}

function cerrar_modal_encargado() {
	$("#Registrar_encargado").modal("hide");
	$("#form_personal")[0].reset();
	$('input[name="action"]').val('agregar_encargado');
	$(".div").addClass("delete");

}

function cerrar_modal_detalle() {
	$("#Detalles_encargado").modal("hide");
}

// REGISTRAR ENCARGADOS
/* FORM SUBMIT AJAX*/
$('#form_personal').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_encargado").modal('hide');
		$("#form_personal")[0].reset();
		toastr.success('Se ha registrado correctamente');
		getDataE();
		$('input[name="action"]').val('agregar_encargado');
		$(".div").addClass("delete");

	});
});

$(function() {
	// EDICION DE LOS ENCARGADOS
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Encargado');
		var tr = tablaE.cell($(this).closest('td, li')).index();
		var data = tablaE.row(tr.row).data();

		$('input[name="cedula"]').val(data.cedula);
		$('input[name="action"]').val('editar_encargado');
		$('input[name="nombre"]').val(data.nombre);
		$('input[name="apellido"]').val(data.apellido);
		$('input[name="movil"]').val(data.movil);
		$('input[name="correo"]').val(data.correo);
		$('select[name="funcion"]').val(data.funcion);
		$('textarea[name="direccion"]').val(data.direccion);

		$("#Registrar_encargado").modal('show');
	});

	// DETALLES DE LOS ENCARGADOS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaE.cell($(this).closest('td, li')).index();
		var data = tablaE.row(tr.row).data();
		$("#Detalles_encargado").modal('show');

		$('#ci').text(data.cedula);
		$('#nom').text(data.nombre);
		$('#ape').text(data.apellido);
		$('#dir').text(data.direccion);
		$('#mov').text(data.movil);
		$('#ema').text(data.correo);
		$('#fun').text(data.funcion);

	});

	// ELIMINAR ENCARGADOS
	$('#table tbody').on('click', 'a[rel="delete"]', function () {

		var tr = tablaE.cell($(this).closest('td, li')).index();
		var data_status = tablaE.row(tr.row).data();
		
		var parameters = new FormData();
		parameters.append('action', 'delete_encargado');
		parameters.append('id', data_status.id);
		submit_with_ajax(window.location.pathname,'Notificación', '¿Estas seguro de eliminar al encargado?', parameters, function () {
			toastr.success('Se ha eliminado correctamente');
			getDataE();
		});  

	});
});