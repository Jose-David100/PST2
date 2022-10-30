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
				'action': 'listado_personal'
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
		},{
			"data": "correo"
		}, {
			"data": "sexo"
		}, {
			"data": "status"
		}, {
			"data": "id"
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

		},{
			targets: [-2],
			class: '',
			orderable: true,
			render: function(data, type, row) {
				
				if (row['status'] == 'Activo'){
					var buttons = ' <a href="#" rel="desactivar" class="btn btn-icon btn-success"><i class="fas fa-thumbs-up"></i></a>';
				}else{
					var buttons = ' <a href="#" rel="activar" class="btn btn-icon btn-danger"><i class="fas fa-thumbs-down"></i></a>';
				}
				return buttons;
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
	$('input[name="cedula"]').removeAttr('readonly');
	$('input[name="nombre"]').removeAttr('readonly');
	$('input[name="apellido"]').removeAttr('readonly');
	$('select[name="sexo"]').removeAttr('disabled');
	$('select[name="ocupacion"]').removeAttr('disabled');

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

		$('input[name="cedula"]').removeAttr('readonly');
		$('input[name="nombre"]').removeAttr('readonly');
		$('input[name="apellido"]').removeAttr('readonly');
		$('select[name="sexo"]').removeAttr('disabled');
		$('select[name="ocupacion"]').removeAttr('disabled');
	});
});

$(function() {
	// EDICION DEL PERSONAL
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Personal');
		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data = tablaP.row(tr.row).data();

		//$('input[name="cedula"]').attr('readonly', '');
		$('input[name="nombre"]').attr('readonly', '');
		$('input[name="apellido"]').attr('readonly', '');
		$('select[name="sexo"]').attr('disabled', 'disabled');
		//$('select[name="ocupacion"]').attr('disabled', 'disabled');
		//$('#id_titular_ben').attr('disabled','disabled');

		// ACTION E ID
		$('input[name="action"]').val('editar_personal');
		$('input[name="id"]').val(data.id);

		$('input[name="cedula"]').val(data.cedula);
		$('input[name="correo"]').val(data.correo);
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
		$('#email').text(data.correo);
		$('#sta').text(data.status);

	});

	// ELIMINAR PERSONAL
	$('#table tbody').on('click', 'a[rel="delete"]', function () {

		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data_status = tablaP.row(tr.row).data();
		
		var parameters = new FormData();
		parameters.append('action', 'delete_personal');
		parameters.append('id', data_status.id);
		submit_with_ajax(window.location.pathname,'Notificación', '¿Estas seguro de eliminar al personal?', parameters, function () {
			toastr.success('Se ha eliminado correctamente');
			getDataP();
		});  

	});
	// ACTIVAR PERSONAL
	$('#table tbody').on('click', 'a[rel="activar"]', function () {

		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data_status = tablaP.row(tr.row).data();
		
		var parameters = new FormData();
		parameters.append('action', 'activar_personal');
		parameters.append('id', data_status.id);
		submit_with_ajax(window.location.pathname,'Notificación', '¿Estas seguro de activar al personal?', parameters, function () {
			toastr.success('Se ha activado correctamente');
			getDataP();
		});  

	});
	// INACTIVAR PERSONAL
	$('#table tbody').on('click', 'a[rel="desactivar"]', function () {

		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data_status = tablaP.row(tr.row).data();
		
		var parameters = new FormData();
		parameters.append('action', 'desactivar_personal');
		parameters.append('id', data_status.id);
		submit_with_ajax(window.location.pathname,'Notificación', '¿Estas seguro de inactivar al personal?', parameters, function () {
			toastr.success('Se ha inactivado correctamente');
			getDataP();
		});  

	});
	
});