var tablaP;

// DATA DE ESTABLECIMIENTOS
function getDataP() {
	tablaP = $('#table').DataTable({
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
				'action': 'listado_personal',
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
			"data": "ocupacion"
		}, {
			"data": "sexo"
		}, {
			"data": "status"
		}, {
			"data": "status"
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
	getDataP();
});

// BOTONES PARA LOS MODALES
function abrir_modal_personal() {
	$("#Registrar_personal").modal("show");
}

function cerrar_modal_personal() {
	$("#Registrar_personal").modal("hide");
	$("#form_personal")[0].reset();

}

function cerrar_modal_detalle() {
	$("#Detalle_personal").modal("hide");
}

// REGISTRAR PERSONAL
/* FORM SUBMIT AJAX*/
$('#form_personal').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_personal").modal('hide');
		$("#form_personal")[0].reset();
		toastr.success('Se ha registrado el Personal correctamente');
		getDataP();
	});
});

$(function() {
	// EDICION DEL PERSONAL
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Personal');
		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data = tablaP.row(tr.row).data();

		$('input[name="cedula"]').attr('readonly', '');
		$('input[name="nombre"]').attr('readonly', '');
		$('input[name="apellido"]').attr('readonly', '');
		$('select[name="sexo"]').attr('disabled', 'disabled');
		//$('#id_titular_ben').attr('disabled','disabled');

		$('input[name="cedula"]').val(data.cedula);
		$('input[name="action"]').val('editar_personal');
		$('input[name="nombre"]').val(data.nombre);
		$('input[name="apellido"]').val(data.apellido);
		$('input[name="movil"]').val(data.movil);
		$('textarea[name="direccion"]').val(data.direccion);
		$('select[name="ocupacion"]').val(data.ocupacion);
		$('select[name="sexo"]').val(data.sexo);
		$('select[name="status"]').val(data.status);
		/*$(".titular_modal").val(data.titular_ben.name);
	    $(".titular_modal").change();*/
		$("#Registrar_personal").modal('show');
	});

	// DETALLES DEL PERSONAL 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data = tablaP.row(tr.row).data();
		$("#Detalle_personal").modal('show');

		$('#ci').text(data.cedula);
		$('#nom').text(data.nombre);
		$('#ape').text(data.apellido);
		$('#dir').text(data.direccion);
		$('#mov').text(data.movil);
		$('#ocu').text(data.ocupacion);
		$('#sex').text(data.sexo);
		$('#sta').text(data.status);

	});
});