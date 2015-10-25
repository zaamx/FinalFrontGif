function Utils() {}

Utils.getParameterByName = function (name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//returns timestamp in a human readable format
Utils.formatDate = function (dt_create) {
	var elemDate = new Date(dt_create);
	return elemDate.toDateString() + ' ' + elemDate.toLocaleTimeString();
}

//returns the hostname only for a given URL
Utils.getHostname = function (url) {
	var parser = document.createElement('a');
	parser.href = url;
	return parser.hostname;
}

//returns the hostname only for a given URL
Utils.renderTemplate = function (template, viewData, selector) {
	$.Mustache.load('./templates.html')
    .done(function () {
        $(selector).mustache(template, viewData);
    });	
}

