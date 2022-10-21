var tablaI;
var tblCate;


// LOGICA PARA AGREGAR INGRESOS
var vents = {
	items: {
		fecha: '',
		cantidad: [],
		observacion: '',
		det: []
	},
	get_ids: function() {
		var ids = [];
		$.each(this.items.det, function(key, value) {
			ids.push(value.id);
		});
		return ids;
	},
	add: function(item) {
		this.items.det.push(item);
		this.list()

	},
	list: function() {
		tblCate = $('#tblProducts').DataTable({
			responsive: true,
			autoWidth: false,
			destroy: true,
			ordering: false,
			searching: false,
			paging: false,
			"language": {
				"sProcessing": "Procesando...",
				"sLengthMenu": "Mostrar _MENU_ registros",
				"sZeroRecords": "No se encontraron resultados",
				"sEmptyTable": "Ningún dato disponible en esta tabla",
				"sInfo": "Mostrando _START_ al _END_ de un total de _TOTAL_ registros",
				"sInfoEmpty": "Mostrando 0 al 0 de un total de 0 registros",
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
			data: this.items.det,
			columns: [{
				"data": "id"
			}, {
				"data": "text"
			}, {
				"data": "presentacion"
			}, {
				"data": "cantidad_ingreso"
			}],
			columnDefs: [{
				targets: [0],
				class: 'text-center',
				orderable: false,
				render: function(data, type, row) {

					buttons = '<a href="#" rel="delete" class="btn btn-danger"><i class="fas fa-trash-alt"></i></a> ';
					return buttons;
				}
			}, {
				targets: [-1],
				class: '',
				orderable: false,
				render: function(data, type, row, meta) {
					return '<input type="number"  min="1" value="' + parseInt(data) + '" name="cantidad" class="form-control form-control-sm monto-table" autocomplete="off" required>';
				}
			}, ],
			initComplete: function(settings, json) {

			},
		});

	},
};
$(function() {
	// auto complete search
	$('select[name="search"]').select2({
		dropdownParent: $("#Registrar_ingreso"),
		theme: "bootstrap4",
		language: "es",
		allowClear: true,
		ajax: {
			delay: 250,
			type: "POST",
			url: window.location.pathname,
			data: function(params) {
				var queryParameters = {
					term: params.term,
					action: "listado_vacunas",
					ids: JSON.stringify(vents.get_ids())
				}
				return queryParameters;
			},
			processResults: function(data) {
				var results = [];

				$.each(data, function(index, res) {
					results.push({
						id: res.id,
						text: res.nombre,
						presentacion: res.presentacion,
					});
				});

				return {
					results: results
				};
			},
			cache: true

		},
		placeholder: 'Buscar vacuna ...',
		minimumInputLength: 1,
	}).on('select2:select', function(e) {
		var data = e.params.data;
		data.cantidad_ingreso = 1;
		vents.add(data);
		$(this).val('').trigger('change.select2');

	});

	$('#tblProducts tbody').on('change keyup', '.monto-table', function() {
		let cantidad = $(this).val();
		var tr = tblCate.cell($(this).closest('td, li')).index();
		vents.items.det[tr.row].cantidad_ingreso = parseInt(cantidad);
	});

	// Eliminar el ingreso individual
	$('#tblProducts tbody').on('click', 'a[rel="delete"]', function() {
		var tr = tblCate.cell($(this).closest('td, li')).index();
		vents.items.det.splice(tr.row, 1);
		vents.list();
		toastr.success('Eliminado Correctamente')

	});

	// event submit
	$('#form_ingreso').on('submit', function(e) {
		e.preventDefault();

		if (vents.items.det.length === 0) {
			toastr.error('Debe tener al menos una vacuna en el ingreso');
			return false;
		}

		vents.items.fecha = $('input[name="fecha_ingreso"]').val();
		vents.items.observacion = $('textarea[name="observacion"]').val();

		var parameters = new FormData();
		parameters.append('action', $('input[name="action"]').val());
		parameters.append('vents', JSON.stringify(vents.items));

		submit_with_ajax(window.location.pathname, 'Notifiación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			window.location.replace('/listado-de-ingresos-de-vacunas/');
			$("#form_ingreso")[0].reset();
			$("#Registrar_ingreso").modal('hide');
			toastr.success('Se ha registrado correctamente');

		});
	});
});

// DATA DE INGRESOS
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
			"data": "observacion"
		}, {
			"data": "fecha_ingreso"
		}, {
			"data": "fecha_ingreso"
		}, ],
		columnDefs: [{
			targets: [-1],
			class: 'text-center',
			orderable: false,
			render: function(data, type, row) {

				var buttons = '<a href="#" rel="detail" class="btn btn-icon btn-dark"><i class="fas fa-info"></i></a> ';
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

$(function() {
	// DETALLES DE LAS INGRESOS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaI.cell($(this).closest('td, li')).index();
		var data = tablaI.row(tr.row).data();
		$("#Detalles_ingreso").modal('show');

		$('#fec').text(data.fecha_ingreso);
		$('#obs').text(data.observacion);

		$('#Detalle_ingreso').DataTable({
			responsive: true,
			autoWidth: false,
			destroy: true,
			deferRender: true,
			searching: false,
			paging: false,
			info: false,
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
					'action': 'detalle_ingreso',
					'id': data.id,
				},
				dataSrc: ""
			},
			columns: [{
				"data": "vacuna.nombre"
			}, {
				"data": "vacuna.presentacion"
			}, {
				"data": "cantidad_ingreso"
			}, ],
			columnDefs: [],
			initComplete: function(settings, json) {

			}
		});

	});
});