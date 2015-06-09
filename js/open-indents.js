$(document).ready(function(){
	showLoading();
	page_url = window.location.href;
	getParameterByName(page_url);
    pageType = getParameterByName('type');
    // console.log(pageType)

    $.ajax({
    	url : 'http://qa.bajaj.gladminds.co/v1/container-trackers/?access_token='+localStorage.getItem('access_token')+'&status='+pageType,
    	type : 'GET',
    	dataType : 'json',
    	success : function(indents, status) {
    		create_indents(indents);
    	},
    	error : function(e) {
    		if(e.status == 401) {
    			alert("Something is wrong. Please try again")
    		}
    	}
    })

})

create_indents = function(indents) {
	// console.log(indents.objects[0].transaction_id);
	for(i=0; i<indents.objects.length;i++) {
		indentNo = indents.objects[i].zib_indent_num;
		txtIndents = '<tr>\
                        <td class="indent_but"><a href="indent-details.html?&indent='+indentNo+'&transaction='+indents.objects[i].transaction_id+'&type='+pageType+'">'+indentNo+'</a></td>\
                        <td></td>\
                        <td>'+indents.objects[i].no_of_containers+'</td>\
                    </tr>';
        $("#indents_table").append(txtIndents)
	}
	hideLoading()
}

function showLoading(){
    $("#loading").show();
}

function hideLoading(){
    $("#loading").hide();
}