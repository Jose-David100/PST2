var tablaV;

// DATA DE ESTABLECIMIENTOS
function getDataV() {
	tablaV = $('#table').DataTable({
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
				'action': 'listado_vacunas',
			},
			dataSrc: ""
		},
		columns: [{
			"data": "nombre"
		}, {
			"data": "presentacion"
		}, {
			"data": "existencia"
		}, {
			"data": "existencia"
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

		}],
		initComplete: function(settings, json) {

		}
	});
};
$(function() {
	getDataV();
});

// BOTONES PARA LOS MODALES
function abrir_modal_vacunas() {
	$("#Registrar_vacunas").modal("show");
	$(".div").removeClass('delete');
}

function cerrar_modal_vacunas() {
	$("#Registrar_vacunas").modal("hide");
	$("#form_vacunas")[0].reset();
	$(".div").addClass('delete');
}

function abrir_modal_reporte() {
	$("#reportes").modal("show");
}

function cerrar_modal_reporte() {
	$("#reportes").modal("hide");
}

function cerrar_modal_detalle() {
	$("#Detalles_vacunas").modal("hide");
}
// REGISTRAR PERSONAL
/* FORM SUBMIT AJAX*/
$('#form_vacunas').on('submit', function(e) {
	e.preventDefault();
	var parameters = new FormData(this);
	submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
		$("#Registrar_vacunas").modal('hide');
		$("#form_vacunas")[0].reset();
		toastr.success('Se ha registrado correctamente');
		getDataV();
	});
});

$(function() {
	// EDICION DE LAS VACUNAS
	modal_title = $('#staticBackdropLabel');
	$("#table tbody").on('click', 'a[rel="edit"]', function() {
		modal_title.html('Editar Vacuna');
		var tr = tablaV.cell($(this).closest('td, li')).index();
		var data = tablaV.row(tr.row).data();

		//$('input[name="nombre"]').attr('readonly', '');
		$('input[name="existencia"]').attr('readonly', '');

		$('input[name="nombre"]').val(data.nombre);
		$('input[name="id"]').val(data.id);
		$('input[name="action"]').val('editar_vacuna');
		$('input[name="presentacion"]').val(data.presentacion);
		$('input[name="existencia"]').val(data.existencia);
		$("#Registrar_vacunas").modal('show');
	});

	// DETALLES DE LAS VACUNAS 
	$('#table tbody').on('click', 'a[rel="detail"]', function() {
		var tr = tablaV.cell($(this).closest('td, li')).index();
		var data = tablaV.row(tr.row).data();
		$("#Detalles_vacunas").modal('show');

		$('#nom').text(data.nombre);
		$('#pre').text(data.presentacion);
		$('#exi').text(data.existencia);
		
		// FUNCION ASINCRONA PARA LAS CONSULTAS

		/** TABLA DINAMICA PARA NO REPETIR CODIGO */
		const getData = async (id_table, data_params, data_columns, data_columns_def, data_url) => {

			tblCate = $(id_table).DataTable({
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
					url: data_url,
					type: 'POST',
					data: data_params,
					dataSrc: ""
				},
				columns: data_columns,
				columnDefs: data_columns_def,
				initComplete: function (settings, json) {

				},

			});

		}

		$(async function () {
			btn_ingreso.addEventListener('click', async () => {
				//** cargar tabla con sus parametros */
				await getData(
					'#Detalle_vacunas',
					{
						'action': 'detalle_ingreso',
						'id': data.id
					},
					[
						{"data": "cantidad_ingreso"},
						{"data": "lote"},
						{"data": "ingreso.fecha"},
						{"data": "fecha_vencimiento"},
					],
					[
					],
					'/detalles-de-vacunas/',
				);    
			});
			btn_salida.addEventListener('click', async () => {
				//** cargar tabla con sus parametros */
				await getData(
					'#table_salida',
					{
						'action': 'detalle_salida',
						'id': data.id
					},
					[
						{"data": "cantidad"},
						{"data": "lote"},
						{"data": "fecha_vencimiento"},
						{"data": "salida.ced_personal"},
						{"data": "salida.fecha"},
						{"data": "salida.nom_estable"},
					],
					[
					],
					'/detalles-de-vacunas/',
				);
			});    
			btn_ingreso.click();
		});
		
	});
});

//  REPORTES

// PARA INGRESOS DE VACUNAS
$(function() {
    $('input[name="fecha_ingreso"]').daterangepicker({
      opens: 'left',
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
    }).on('apply.daterangepicker', function(ev, picker) {
        window.open('/reporte-de-ingresos-de-vacunas/'+ picker.startDate.format('YYYY-MM-DD') +'/'+ picker.endDate.format('YYYY-MM-DD'))
        
    });;
});

// PARA SALIDAS DE VACUNAS
$(function() {
    $('input[name="fecha_salida"]').daterangepicker({
      opens: 'left',
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
    }).on('apply.daterangepicker', function(ev, picker) {
        window.open('/reporte-de-salida-de-vacunas/'+ picker.startDate.format('YYYY-MM-DD') +'/'+ picker.endDate.format('YYYY-MM-DD'))
        
    });;
});