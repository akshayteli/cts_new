serverhost = "";
if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}
$(document).ready(function(){
	showLoading();
    var page_url = window.location.href;
    getParameterByName(page_url);
    prodId = getParameterByName('page');
    if(prodId == "city"){
    	action = "getCities";
    } else if (prodId == "state") {
    	action = "getStates";
    } else {
    	window.location.href = "dss.html";
    }
    getAdminData(action);


   hideLoading();
});


var admin = {
    adminTable_getCities : function(adminData) {
        console.log(adminData);
        var city_header = '<th>City ID</th><th>City Name</th><th>State</th><th>Edit</th>';
        $("#dss-addData-header").append(city_header);

        for (var i = 0; i < adminData.length; i++) {
        	var txtState_name = adminData[i].state_name;

        	for (var j = 0; j < adminData[i].cities.length; j++) {

        		var cityId = adminData[i].cities[j].city_id;
        		var txtCity_name = adminData[i].cities[j].city_name;

        		var tableData = '<tr><td>'+cityId+'</td><td>'+txtCity_name+'</td><td>'+txtState_name+'</td><td><a href="#">Edit</a> | <a href="#">Delete</a></td></tr>';
        		$("#bajaj-dss-addData-tbody").append(tableData);
        	}

        	
        	$("#bajaj-addData_dss").css("display", "block");
        };
    },
    adminTable_getStates: function(adminData) { 
        console.log(adminData);

        var state_header = '<th>State ID</th><th>State Name</th><th>Edit</th>';
        $("#dss-addData-header").append(state_header);
    }
};

function getAdminData(action) {
	$.ajax({ 
	        type: 'GET', 
	        url: host+ 'index.php?action='+action , 
	        data: { get_param: 'value' }, 
	        dataType: 'json',
	        success: function (adminData, status) {
	        		admin['adminTable_' + action](adminData);
	            },
	        error: function(e){
	            console.log(e);
	        }
	    });
}

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