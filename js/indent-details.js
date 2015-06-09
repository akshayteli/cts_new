$(document).ready(function(){
	showLoading();
	check_data();
	
	page_url = window.location.href;
	getParameterByName(page_url);
    pageIndent = getParameterByName('indent');
    pageType = getParameterByName('type');
    pageTransaction = getParameterByName('transaction');
    $(".txtIndentNo").text(pageIndent)

    var breadcrum = '<li class="first"><a href="home.html" style="z-index:9;"><span></span>Dashboard</a></li>\
                    <li class="first"><a href="open-indents.html?type='+pageType+'" style="z-index:8;"><span></span>Open Indents</a></li>\
                    <li class="first"><a href="#" style="z-index:7;"><span></span>Indent Details</a></li>';
        $(".crumbs").append(breadcrum)

    $.ajax({
    	url : '//qa.bajaj.gladminds.co/v1/container-trackers/?access_token='+localStorage.getItem('access_token')+'&zib_indent_num='+pageIndent,
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

var len;
createLR = function(indent_data) {

	var ind = indent_data.objects;
	len = ind.length;
	for(i=0;i<ind.length;i++) {
		LrData = '<tr>\
                <td class="btn-lr-detail lr_'+i+'" data-toggle="modal" data-target="#'+ind[i].lr_number+'" rel="'+ind[i].lr_number+'" data-container_no="'+ind[i].container_no+'" data-seal_no="'+ind[i].seal_no+'">'+ind[i].lr_number+'</td>\
                <td>'+ind[i].truck_no+'</td>\
                <td>'+ind[i].no_of_containers+'</td>\
            </tr>';

        $("#Lrdata").append(LrData);
	}
	
	for(x=0;x<ind.length;x++) {
		var lr_details = '<div class="modal modal-flex fade in" id="'+ind[x].lr_number+'" tabindex="-1" role="dialog" aria-labelledby="flexModalLabel" aria-hidden="false">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                    <h4 class="modal-title" id="flexModalLabel">Enter Details</h4>\
                </div>\
                <div class="modal-body">\
                    <div class="row">\
                        <div class="col-lg-12">\
                                <label for="textInput" class="col-sm-4 control-label">Indent No.:</label>\
                                <div class="col-sm-8">\
                                    <input type="text" class="form-control" id="indNumDisp" value="" disabled="">\
                                </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-lg-12">\
                                <label for="textInput" class="col-sm-4 control-label">LR No.:</label>\
                                <div class="col-sm-8">\
                                    <input type="text" class="form-control" id="LRNumDisp" value="" disabled="">\
                                </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-lg-12">\
                                <label for="contNum" class="col-sm-4 control-label">Container No.:</label>\
                                <div class="col-sm-8">\
                                    <input type="text" name="contNum" class="form-control" id="contNum" placeholder="ABCD1234" maxlength="11" value="'+ind[x].container_no+'" ><small>First 4 characters than 7 digits</small>\
                                </div>\
                        </div>\
                    </div>\
                    <div class="row">\
                        <div class="col-lg-12">\
                                <label for="sealNum" class="col-sm-4 control-label">Seal No.:</label>\
                                <div class="col-sm-8">\
                                    <input type="text" name="contNum" class="form-control" id="sealNum" placeholder="Enter Seal No." value="'+ind[x].seal_no+'">\
                                </div>\
                        </div>\
                    </div>\
                </div>\
                <div class="modal-footer">\
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                    <button type="submit" class="btn btn-green" id="saveLrDetails">Save</button>\
                </div>\
            </div>\
        </div>\
    </div>';	

    $(".lr_details_block").append(lr_details);
	}
	
	hideLoading();
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
	
	if(container_no.length != 11) {
		$("#contNum").addClass("warning_msg");
			alert("Please fill a valid container no");
			return;
	} else {
		if (container_no.substr(0, 4).search(/[^a-zA-Z]+/) === -1) {
			if(container_no.substr(4, 11).search(/^[0-9\b]+$/) === 0) {
				// alert("all ok")
				pushValues(seal_no, container_no);


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
});

pushValues = function(seal_no, container_no) {
	var arrValues = {
		"consignment_id": pageIndent,
	    "container_no": container_no,
	    "resource_uri": "/v1/container-trackers/"+pageTransaction+"/",
	    "seal_no": seal_no,
	    "sent_to_sap": false,
	    "status": "Inprogress"
	};

	console.log(arrValues)

	$.ajax({
		url : '//qa.bajaj.gladminds.co/v1/container-trackers/'+pageTransaction,
		data : arrValues,
		type : 'PUT',
		success : function(status) {
			console.log(status);
			alert("data saved")
		},
		error : function(e) {
			if (e.status == 401) {
				alert("Something is wrong. Please check your internet connection try again");
			}
		}
	});
}


window.setInterval(function(){
	check_data();
}, 5000);

check_data = function() {
	for(p=0; p<len; p++) {
		txtSeal_no = $(".lr_"+p).attr('data-seal_no');
		txtCont_no = $(".lr_"+p).attr('data-container_no');
	
		if((txtCont_no == "") || (txtSeal_no == "")) {
			console.log("fields empty")
			return
		} else {
			console.log("all field filled")
			$(".indent-submit-btn").removeClass('disabled')
		}
	}
}