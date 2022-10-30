// LOGICA PARA AGREGAR INGRESOS
var vents = {
	items: {
		fecha: '',
		cantidad: [],
		observacion: '',
		personal: '',
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
			autoWidth: true,
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
			}, {
				"data": "id"
			}, {
				"data": "id"
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
				targets: [-3],
				class: '',
				orderable: false,
				render: function(data, type, row, meta) {
					return '<input type="number"  min="1" value="' + parseInt(data) + '" name="cantidad" class="form-control form-control-sm monto-table" autocomplete="off" required>';
				}
			},{
				targets: [-2],
				class: '',
				orderable: false,
				render: function(data, type, row, meta) {
					return '<input type="text"  name="lote" class="form-control form-control-sm lote-table" autocomplete="off" placeholder="Lote" required>';
				}
			},{
				targets: [-1],
				class: '',
				orderable: false,
				render: function(data, type, row, meta) {
					return '<input type="date"  name="fecha_ven" class="form-control form-control-sm fecha_ven-table" format="YYYY-MM-DD" autocomplete="off" required>';
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

	$('#tblProducts tbody').on('change keyup', '.lote-table', function() {
		let lote = $(this).val();
		var tr = tblCate.cell($(this).closest('td, li')).index();
		vents.items.det[tr.row].lote = lote;
	});

	$('#tblProducts tbody').on('change keyup', '.fecha_ven-table', function() {
		let fecha_ven = $(this).val();
		var tr = tblCate.cell($(this).closest('td, li')).index();
		vents.items.det[tr.row].fecha_vencimiento = fecha_ven;
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
		vents.items.personal = $('select[name="personal"]').val();

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

// SELECT2
$(document).ready(function() {
	$("#id_vacuna").select2({
		placeholder: 'Seleccione la Vacuna',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
	$("#per_responsable").select2({
		placeholder: 'Seleccione el Personal',
		theme: 'bootstrap4',
		language: "es",
		allowClear: true
	});
});