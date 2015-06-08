$(document).ready(function(){
	showLoading();
	page_url = window.location.href;
	getParameterByName(page_url);
    pageIndent = getParameterByName('indent');
    pageTransaction = getParameterByName('transaction');
    console.log(pageIndent);
    console.log(pageTransaction);

    $(".txtIndentNo").text(pageIndent)

    $.ajax({
    	url : 'http://qa.bajaj.gladminds.co/v1/container-trackers/?access_token=f55443f6371c0649b9efa96b10860133398cf89c&zib_indent_num='+pageIndent,
    	type : 'GET',
    	dataType : 'json',
    	success : function(indent_data, status) {
    		createLR(indent_data)
    	},
    	error : function(e) {
    		if(e.status == 401) {
				alert("Something is wrong. Please try again");
				return;
			}
    	}
    })
})

createLR = function(indent_data) {
	for(i=0;i<indent_data.objects.length;i++) {
		LrData = '<tr>\
                <td class="btn-lr-detail" data-toggle="modal" data-target="#flexModal" rel="'+indent_data.objects[i].lr_number+'">'+indent_data.objects[i].lr_number+'</td>\
                <td>'+indent_data.objects[i].truck_no+'</td>\
                <td>'+indent_data.objects[i].no_of_containers+'</td>\
            </tr>';

        $("#Lrdata").append(LrData);
	}
	
	hideLoading();
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

$(document).on('click', '.btn-lr-detail', function(){
	var rel = $(this).attr('rel')
	// console.log(rel)
	$("#indNumDisp").val(pageIndent);
	$("#LRNumDisp").val(rel)
});

$("#saveLrDetails").click(function(){
	$("#contNum, #sealNum").removeClass("warning_msg");
	var container_no = $("#contNum").val();
	var seal_no = $("#sealNum").val();
	if(container_no == "") {
		$("#contNum").focus();
		$("#contNum").addClass("warning_msg");
		return;
	}
	if(seal_no == "") {
		$("#sealNum").focus();
		$("#sealNum").addClass("warning_msg");
		return;
	}

// 	if(container_no.length == 8) {
// 		if (container_no.substr(0, 4).search(/[^a-zA-Z]+/) === -1) {
// 	 		if(seal_no.substr(4, 8).search(/^[0-9\b]+$/) === -1) {
// 				alert("all ok");
// 			else {
// 				$("#contNum").addClass("warning_msg");
// 				alert("Please fill a valid container no");
// 				return;
// 			}
// }
// 		} else {
// 			$("#contNum").addClass("warning_msg");
// 			alert("Please fill a valid container no")
// 			return;
// 		}
// 	} else {

// 			$("#contNum").addClass("warning_msg");
// 			alert("Please fill a valid container no");
// 			return;
// 			}

	
	if(container_no.length != 8) {
		$("#contNum").addClass("warning_msg");
			alert("Please fill a valid container no");
			return;
	} else {
		if (container_no.substr(0, 4).search(/[^a-zA-Z]+/) === -1) {
			if(container_no.substr(4, 8).search(/^[0-9\b]+$/) === -1) {
				alert("all ok")
			} else {
				$("#contNum").addClass("warning_msg");
				alert("Please fill a valid container no");
				return;
			}
		}else {
				$("#contNum").addClass("warning_msg");
				alert("Please fill a valid container no");
				return;
		}
	}










		// check_container_no_var = regex_var.test(container_no.substr(0, 4));
		// if(check_container_no_var) {
		// 	alert("ok");
		// } else {
		// 	alert("not ok")
		// }

		// check_container_no_num = container_no.substr(4, 8);
	
})