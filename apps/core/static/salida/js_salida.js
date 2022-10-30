
// fin salida de vacunas

// DATA DE SALIDAS DE VACUNAS
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
		columns: [ {
			"data": "observacion"
		},{
			"data": "fecha_salida"
		}, {
			"data": "personal.cedula"
		}, {
			"data": "establecimiento.nombre"
		}, {
			"data": "personal"
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
			targets: [0],
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

function cerrar_modal_detalle() {
	$("#Detalles_ingreso").modal("hide");
}

$(function() {
	// DETALLES DE LAS SALIDAS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaS.cell($(this).closest('td, li')).index();
		var data = tablaS.row(tr.row).data();
		$("#Detalles_ingreso").modal('show');

		$('#obs').text(data.observacion);
		$('#fec').text(data.fecha_salida);
		$('#ced').text(data.personal.cedula);
		$('#est_rec').text(data.establecimiento.nombre);

		$('#detalle_salida').DataTable({
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
					'action': 'detalle_salida',
					'id': data.id,
				},
				dataSrc: ""
			},
			columns: [{
				"data": "vacuna.nombre"
			}, {
				"data": "vacuna.presentacion"
			}, {
				"data": "cantidad"
			},{
				"data": "salida.fecha"
			} ],
			columnDefs: [],
			initComplete: function(settings, json) {

			}
		});
	});
});