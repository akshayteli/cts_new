var radioID;

$(document).ready(function(){
	$.ajax({ 
	        type: 'GET', 
	        url: "js/api/dss/moreinfo_audits/audit_process.json", 
	        data: { get_param: 'value' }, 
	        dataType: 'json',
	        success: function (ques_process, status) {
	        			create_process_ques(ques_process); 
	        		
	            },
	        error: function(e){
	            console.log(e);
	        }
	    });

});


function create_process_ques(ques_process) {
	console.log(ques_process);

	var processData = '<div><h3>Process</h3></div><div class="col-lg-12">';

	for (var i=0;i<ques_process.process.length;i++) {
		processData += '<div class="portlet portlet-default"><div class="portlet-heading"><div class="col-md-12 clearfix portlet-title padding-zero"><div class="col-md-6 col-sm-6 col-xs-12 padding-zero"><h4>'+ques_process.process[i].type_name+'</h4></div><div class="col-md-6 col-sm-6 col-xs-12 process-ques-head-totals padding-zero text-right"><label>Adherence : <span>'+ques_process.process[i].adherence+'</span><br><label>Total Score : <span>'+ques_process.process[i].total_score+'</span></div></div><div class="clearfix"></div></div>';

		for (var j=0;j<ques_process.process[i].headings.length;j++) {
        	processData += '<div id="defaultPortlet" class="panel-collapse collapse in"><div class="portlet-body clearfix"><h4>'+ques_process.process[i].headings[j].heading_name+'</h4>';


                for (var k=0;k<ques_process.process[i].headings[j].questions.length;k++) {
		        	radioID = ques_process.process[i].headings[j].questions[k].question_id;
		        
                	processData += '<div class="panel panel-default"><div class="panel-heading"><p class="panel-title">'+ques_process.process[i].headings[j].questions[k].question+'<span class="label ans_label"><form><div class="btn-group" data-toggle="buttons"><label class="btn btn-ques-radio"><input class="ques-radioBtns" type="radio" id="sal" value="20" name='+radioID+' />YES</label><label class="btn btn-ques-radio  bttn"><input class="ques-radioBtns" type="radio" id="sal1" value="0" name='+radioID+' />NO</label><label class="btn btn-ques-reset resetbttn"><input type="radio" onclick="document.getElementById("sal").checked=false;document.getElementById("sal1").checked=false"/>RESET </label></div></form></span></p><p><label class="edit-labels">Max. Score  : </label><span>20</span></p><p><label class="edit-labels">Dealer Score: </label><span>'+ques_process.process[i].headings[j].questions[k].marks+'</span></p><p><label class="edit-labels-textarea">Remarks :</label><textarea colspan="4" rowspan="2"></textarea></p></div></div>';
                }
                                        
            processData += '</div></div>';
        }
                                 
		processData += '</div>';


	}
			$("#audit-questionnaire-area").append(processData);



}

$(document).ready(function(){

})

// $( document ).on( 'click', '.ques-radioBtns', function () {
	
// var selected = $("input[type='radio'][name= '+radioID']:checked");
// });



// function read_values(radioID) {
// 	console.log(radioID);
// 	$('input[name='+radioID+']').click(function() {
//       var score = ($('input[name='+radioID+']:checked').val());
//       console.log(score);
//       // document.getElementById("selected-price").innerHTML = priceRange;
//   });
// }
