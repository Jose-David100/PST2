// Messages erros
function message_error(obj) {
	let html = '';
	if (typeof(obj) === 'object') {
		$.each(obj, function(key, value) {
			html += value
		})
	} else {
		html = obj
	}

	toastr.error(html)

}
/* jquery confirm para formularios */
function submit_with_ajax(url, title, content, parameters, callback) {
	$.confirm({
		theme: 'bootstrap',
		title: title,
		icon: 'fas fa-comments',
		content: content,
		columnClass: 'small',
		typeAnimated: true,
		cancelButtonClass: 'btn-primary',
		draggable: true,
		dragWindowBorder: false,
		buttons: {
			info: {
				text: "Si",
				btnClass: 'btn-primary',
				action: function() {
					$.ajax({
						url: url, //window.location.pathname
						type: 'POST',
						data: parameters,
						dataType: 'JSON',
						processData: false,
						contentType: false,
					}).done(function(data) {
						if (!data.hasOwnProperty('error')) {
							callback();
							return false;
						}
						message_error(data.error);
					}).fail(function(jqXHR, textStatus, errorThrown) {
						alert(textStatus + ': ' + errorThrown);
					}).always(function(data) {

					});
				}
			},
			danger: {
				text: "No",
				btnClass: 'btn-red',
				action: function() {

				}
			},
		}
	})
}

// SUBMIR ACTION
function submit_action(title, content, callback) {
	$.confirm({
		theme: 'bootstrap',
		title: title,
		icon: 'fas fa-comments',
		content: content,
		columnClass: 'small',
		typeAnimated: true,
		cancelButtonClass: 'btn-primary',
		draggable: true,
		dragWindowBorder: false,
		buttons: {
			info: {
				text: "Si",
				btnClass: 'btn-primary',
				action: function() {
					callback();
				}
			},
			danger: {
				text: "No",
				btnClass: 'btn-red',
				action: function() {

				}
			},
		}
	})
}

// PARA CERRAR SECCION 
/*$(function () {
    $('a[id="btn-logout"]').on('click', function () {

        submit_action('Notifiación', '¿Estas seguro de cerrar sesión?', function () {
            
            window.location.replace("/accounts/logout/");
            
        });
    });
});*/