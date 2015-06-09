$(document).ready(function(){
	$(".user_name").text(localStorage.getItem('user_id'))
})

function getParameterByName(url) {
    url = url.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + url + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function showLoading(){
    $("#loading").show();
}

function hideLoading(){
    $("#loading").hide();
}


$("#logout-user").click(function(){
	// alert("logout-user")
	// logout();
	localStorage.clear();
	window.location.href = "index.html";
})
