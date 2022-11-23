var tablaP;

// DATA DE PERSONAL
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
				buttons += '<a href="#" rel="edit" class="btn btn-icon btn-dark edit"><i class="fas fa-edit"></i></a> ';
				buttons += '<a href="#" rel="delete" class="btn btn-icon btn-dark delete"><i class="fas fa-trash"></i></a> ';
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
				
				if (row['status'] == 'Inactivo'){
					var buttons = ' <a href="#" rel="activar" class="btn btn-icon btn-danger"><i class="fas fa-thumbs-down"></i></a>';
					//var buttons = ' <a href="#" rel="desactivar" class="btn btn-icon btn-success"><i class="fas fa-thumbs-up"></i></a>';
				}else{
					//var buttons = ' <a href="#" rel="activar" class="btn btn-icon btn-danger"><i class="fas fa-thumbs-down"></i></a>';
					return data;
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
	$('input[name="id"]').val(0);
	$('input[name="cedula"]').removeAttr('readonly');
	$('input[name="nombre"]').removeAttr('readonly');
	$('input[name="apellido"]').removeAttr('readonly');
	$('select[name="sexo"]').removeAttr('disabled');
	$('select[name="ocupacion"]').removeAttr('disabled');
	$(".div").removeClass("delete");

}

function cerrar_modal_personal() {
	$("#Registrar_personal").modal("hide");
	$("#form_personal")[0].reset();
	$('input[name="action"]').val('agregar_personal');
	$(".div").addClass("delete");
}

function cerrar_modal_detalle() {
	$("#Detalle_personal").modal("hide");
}

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
			getDataP();
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

$(function() {
	// EDICION DEL PERSONAL
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Personal');
		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data = tablaP.row(tr.row).data();

		// ACTION E ID
		$('input[name="action"]').val('editar_personal');
		$('input[name="id"]').val(data.id);

		$('select[name="tipo_ci"]').val(data.tipo_ci);
		$('input[name="cedula"]').val(data.cedula);
		$('input[name="correo"]').val(data.correo);
		$('input[name="nombre"]').val(data.nombre);
		$('input[name="apellido"]').val(data.apellido);
		$('input[name="movil"]').val(data.movil);
		$('textarea[name="direccion"]').val(data.direccion);
		$('select[name="ocupacion"]').val(data.ocupacion);
		$('select[name="sexo"]').val(data.sexo);
		$('select[name="status"]').val(data.status);
		$('select[name="rol_sistema"]').val(data.rol_sistema);
		/*$(".titular_modal").val(data.titular_ben.name);
	    $(".titular_modal").change();*/
		$("#Registrar_personal").modal('show');
	});

	// DETALLES DEL PERSONAL 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaP.cell($(this).closest('td, li')).index();
		var data = tablaP.row(tr.row).data();
		$("#Detalle_personal").modal('show');

		$('#tipo').text(data.tipo_ci);
		$('#ci').text(data.cedula);
		$('#nom').text(data.nombre);
		$('#ape').text(data.apellido);
		$('#fecha').text(data.fecha_nacimiento);
		$('#dir').text(data.direccion);
		$('#mov').text(data.movil);
		$('#ocu').text(data.ocupacion);
		$('#sex').text(data.sexo);
		$('#email').text(data.correo);
		$('#sta').text(data.status);
		$('#rol').text(data.rol_sistema);

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