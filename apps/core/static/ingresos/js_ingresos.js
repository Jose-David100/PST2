var tablaI;
var tblCate;




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

		$('#Detalle_vacuna').DataTable({
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
			},{
				"data": "lote"
			},{
				"data": "fecha_vencimiento"
			}, ],
			columnDefs: [],
			initComplete: function(settings, json) {

			}
		});

	});
});