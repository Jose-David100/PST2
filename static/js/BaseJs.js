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
$(function () {
    $('a[id="btn-logout"]').on('click', function () {

        submit_action('Notificación', '¿Estas seguro de cerrar sesión?', function () {
            
            window.location.replace("/accounts/logout/");
            
        });
    });
});

//Solo texto
function Solo_Texto(e) {
  var code;
  if (!e) var e = window.event;
  if (e.keyCode) code = e.keyCode;
  else if (e.which) code = e.which;
  var character = String.fromCharCode(code);
  var AllowRegex  = /^[\ba-zA-Z\s]$/;
  if (AllowRegex.test(character)) return true;     
  return false; 
}
//Solo numeros
function Solo_Numero(e){
  var keynum = window.event ? window.event.keyCode : e.which;
  if ((keynum == 8) || (keynum == 46))
  return true;
  return /\d/.test(String.fromCharCode(keynum));
}

//Solo numeros sin puntos 
function Solo_Numero_ci(e){
  var keynum = window.event ? window.event.keyCode : e.which;
  if ((keynum == 8))
  return true;
  return /\d/.test(String.fromCharCode(keynum));
}

// solo numeros y letras sin caracteres especiales
function Texto_Numeros(e) {
  var code;
  if (!e) var e = window.event;
  if (e.keyCode) code = e.keyCode;
  else if (e.which) code = e.which;
  var character = String.fromCharCode(code);
  var AllowRegex  = /^[A-Za-z0-9\s\.,-]+$/g;
  if (AllowRegex.test(character)) return true;     
  return false; 
}