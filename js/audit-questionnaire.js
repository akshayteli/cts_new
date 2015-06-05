C = console.log.bind(console)
var max_dealerScore;
if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}
$(document).ready(function(){
	showLoading();

	showDealerInfo();

	var categoryID = localStorage['type_id'] - 1;

	var auditCategoreis = [{"category":"Process"},{"category":"Manpower"},{"category":"Tools and Equipment"},{"category":"Infrastructure and CI Elements"}]

	var breadcrumb = '<ul class="crumbs">\
                        <li class="first"><a href="dss.html" style="z-index:9;"><span></span>Dealership Service Standards</a></li>\
                        <li><a href="audit-report_new.html" style="z-index:8;">Audit Report</a></li>\
                        <li><a href="#" style="z-index:7;">'+auditCategoreis[categoryID].category+'</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrumb);

  	$.getJSON( host+"index.php?action=fetchQuestions&audit_id="+localStorage['auditID']+"&typeID="+localStorage['type_id'], function( data ) {


  		if(localStorage['type_id'] == 2){
  			// console.log(data)
  			getManpower();

  			return;
  		}

  		if(localStorage['type_id'] == 3){
  			// console.log(data)
  			toolsAndEquipment();
  			return;
  		}


  		//if view is shown from the Submitted section
  		if(data.editable==0){
        	$("#audit-questionnaire-area").append(create_process_ques(data));
        	hideLoading();

			$("#accordion").on('shown.bs.collapse', function(){
		        $(this).find(".acc-heading.accordion-active").focus();
		    });
        }
        else{

			$("#audit-questionnaire-area").append(create_process_ques_edit(data));

			str = '<div class="row"><div class="col-md-12 col-xs-12" style="text-align:center;"><button type="button" class="btn btn-primary submit-btn-edit col-md-6 col-xs-12" onclick="saveAllForms()">Save All Forms</button></div></div>'
			$("#audit-questionnaire-area").append(str);
			$(".input_customer_details").mask("9999999999",{placeholder:""});

	        //debugger;
	        customerMarks($(".dealerscore0")[0]);


			$("#accordion").on('shown.bs.collapse', function(){
		        $(this).find(".acc-heading.accordion-active").focus();
		    });

        }


    });

	$('.padding-zero a').click(function() {
	    if($(this).hasClass('collapsed')) {
	        $('.accordion-toggle').not(this).addClass('collapsed');
	    }
	});

	$('.panel-collapse').on('show,hide', function (n) {
		// alert("in")
	    $(n.target).parents(".panel").find("panel-heading h4 i").toggleClass('fa-chevron-up fa-chevron-down');
	});


	$(document).on("keydown", ".auditRemarks",function(){
		$(getParentQuestion($(this))).removeClass("redFont")
	})

});
function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
mainCount = genCharArray('A', 'Z');

function create_process_ques(ques_process, processID) {

	//debugger
	// C(processID)
	var processData = '<div><h3>Process</h3></div><div class="col-lg-12 panel-group" id="accordion">';
	processObj = ques_process.process;

	for (var i=0;i<processObj.length;i++) {

		processData += '<div class="panel panel-default clearfix"><div class="panel-heading"><div class="col-md-12 clearfix portlet-title padding-zero"><div class="col-md-6 col-sm-6 col-xs-12 padding-zero" style="width:80%"><a class="audit-accordian" data-toggle="collapse" data-parent="#accordion" href="#'+processObj[i].id+'"> <h4 class="acc-heading" tabindex="1">'+processObj[i].type_name+'</h4></a></div><div class="col-md-6 col-sm-6 col-xs-12 process-ques-head-totals padding-zero text-right" style="width:20%"><label>Weightage : <span>'+processObj[i].weightage+'</span></label><br><label>Total Score: <span>'+processObj[i].total_score+'</span></label><br><label>Adherence : <span>'+processObj[i].adherence+'</span></label></div></div><div class="clearfix"></div></div>';
			techStr = "<span class='grey'>";
			reg_no = "<span class='grey'>";

			if(processObj[i].id == 2 || processObj[i].id==8)
				techStr += "Service Advisor Name: ";
			else if(processObj[i].id == 4)
				techStr += "Floor Supervisor Name: ";
			else if((processObj[i].id == 5) || (processObj[i].id == 6) || (processObj[i].id == 13)){
				techStr += "Technician Name: ";
				reg_no += "Vehicle Reg. Number or Last 5 Digit of Chassis Number: "
			}
			else if((processObj[i].id == 7))
				techStr += "Inspector Name: ";
			else
				techStr += "";

			techStr += "</span>";
			reg_no += "</span>";

			// alert(techStr)

        	processData += '<div id='+processObj[i].id+' class="panel-collapse collapse"><div class="panel-body clearfix">';

		for (var j=0;j<processObj[i].headings.length;j++) {
		/*
			if((processObj[i].id == 6))
				alert(processObj[i].headings[j].technician_name)*/
			if(processObj[i].headings[j].sub_heading_name!=undefined)
				processData +='<h4 style="color:#333;">'+processObj[i].headings[j].sub_heading_name+'</h4><hr style="margin:0;"/>';

			if(processObj[i].headings[j].technician_name!=undefined)
				processData +='<Strong><h5 style="color:#333;">'+techStr+processObj[i].headings[j].technician_name+'</h5></strong>';

			if(processObj[i].headings[j].reg_no!=undefined && ((processObj[i].id == 5) || (processObj[i].id == 6) || (processObj[i].id == 13)))
				processData +='<Strong><h5 style="color:#333;">'+reg_no+processObj[i].headings[j].reg_no+'</h5></strong>';

			if(processObj[i].headings[j].sub_heading_name=="Others" && processObj[i].headings[j].comments!=undefined){

				processData +='<Strong><h5 style="color:#333;">Comments: '+processObj[i].headings[j].comments+'</h5></strong>';
			}

			if(processObj[i].headings[j].heading_name == undefined) {
				var ques_heading = "";
			} else {
				var ques_heading = processObj[i].headings[j].heading_name;
			}

			

        		qCount = 0;
                for (var k=0;k<processObj[i].headings[j].questions.length;k++) {
                	qCount++;
                	if (processObj[i].headings[j].questions[k].answer >= "1") {
		        		var ans = "YES";
		        		var bg_ans = "green";
		        	}
		        	else {
		        		var ans = "No";
		        		var bg_ans = "red";
		        	}

		        	// C(processObj[i].has_text);


		        	if(processObj[i].id == 6) {
		        		processData += '<div class="panel panel-default"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ processObj[i].headings[j].questions[k].question+'</p><blockquote><p><label>Max. Score : </label> <span>'+processObj[i].headings[j].questions[k].marks+'</span></p><p><label>Dealer Score : </label> <span>'+processObj[i].headings[j].questions[k].answer+'</span></p></blockquote></div></div>'
		        	} else {
		        		if(processObj[i].has_text == 0) {
			        		processData += '<div class="panel panel-default"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ processObj[i].headings[j].questions[k].question+'<span class="label ans_label '+bg_ans+' ">'+ans+'</span></p><blockquote><p><label>Max. Score : </label> <span>'+processObj[i].headings[j].questions[k].marks+'</span></p><p><label>Dealer Score : </label> <span>'+processObj[i].headings[j].questions[k].answer+'</span></p><p><label>Remarks : <label> <span> '+processObj[i].headings[j].questions[k].remarks+'</span></p></blockquote></div></div>';
			        	}
			        	else {
			        		if(processObj[i].headings[j].questions[k].customer_phone == 0) {
			        			processObj[i].headings[j].questions[k].customer_phone = "";
			        		}
							processData += '<div class="panel panel-default"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ processObj[i].headings[j].questions[k].question+'</p><blockquote><p><label>Customer Name : </label> <span>'+processObj[i].headings[j].questions[k].customer_name+'</span></p><p><label>Customer Mobile : </label> <span>'+processObj[i].headings[j].questions[k].customer_phone+'</span></p><p><label>Max. Score : </label> <span>'+processObj[i].headings[j].questions[k].marks+'</span></p><p><label>Dealer Score : </label> <span>'+processObj[i].headings[j].questions[k].answer+'</span></p><p><label>Remarks : <label> <span> '+processObj[i].headings[j].questions[k].remarks+'</span></p></blockquote></div></div>';
		        		}
		        	}


		        	
		        		// if(processObj[i].id == 6) {
		        		// 	$(".ans_label").hide();
		        		// }

		        		
                	
                }
                                        
        }
            processData += '</div></div>';
                                 
		processData += '</div>';


	}
	
	return processData;
}

var count = 0;
function create_process_ques_edit(ques_process) {

	// if(processObj[i].has_text == 0) {

		// alert("submit audits")

	// }

	var processData = '<div class="clearfix process-edit-title"><h3>'+ques_process.audit_type+'</h3></div><div class="col-lg-12 panel-group" id="accordion">';
	
	for (var i=0;i<ques_process.process.length;i++) {

		if (ques_process.process[i].total_score == "") {
            ques_process.process[i].total_score = "-";
        } 
		
        // if(ques_process.process[i].savedCount!=undefined && ques_process.process[i].total_score != "-"){
        // 	ques_process.process[i].total_score = (ques_process.process[i].total_score/ques_process.process[i].savedCount).toFixed(2);
        // 	ques_process.process[i].adherence = ((ques_process.process[i].total_score / ques_process.process[i].weightage)*100).toFixed(2)+ "%";
        // }

		processData += '<div class="panel panel-default clearfix"><div class="panel-heading"><div class="col-md-12 clearfix portlet-title padding-zero"><div class="col-md-6 col-sm-6 col-xs-12 padding-zero" style="width:80%"><a class="audit-accordian" data-toggle="collapse" data-parent="#accordion" href="#'+ques_process.process[i].id+'"><h4 class="acc-heading" tabindex="1">'+ques_process.process[i].type_name+'</h4></a></div><div class="col-md-6 col-sm-6 col-xs-12 process-ques-head-totals padding-zero text-right" style="width:20%"><label>Weightage : <span class="span_weightage">'+ques_process.process[i].weightage+'</span></label><br><label>Total Score: <span class="span_total">'+ques_process.process[i].total_score+'</span></label><br><label>Adherence : <span class="span_adh">'+ques_process.process[i].adherence+'</span></label></div></div><div class="clearfix"></div></div>';

	    if(ques_process.process[i].id!=6 && ques_process.process[i].id!=5 && ques_process.process[i].id!=13){

			for (var j=0;j<ques_process.process[i].headings.length;j++) {
				if(ques_process.process[i].headings[j].heading_name == undefined) {
					var ques_heading = "";
				} else {
					var ques_heading = ques_process.process[i].headings[j].heading_name;
				}

	        	qCount = 0;
	        	count++;

	        	//For Vehicle receiving process and vehicle delivery process accordion
	        	if(ques_process.process[i].id==2 || ques_process.process[i].id==8)
	        		techDiv = "<div style='margin-bottom:10px;'><input type='text' value='"+ques_process.process[i].technician_name+"' name='technicianName' style='width:100%;padding:10px;' placeholder='Enter Service Advisor Name' autocomplete='off'  class='technicianName' /></div>";
	        	else if(ques_process.process[i].id==4)
	        		techDiv = "<div style='margin-bottom:10px;'><input type='text' value='"+ques_process.process[i].technician_name+"' name='technicianName' style='width:100%;padding:10px;' placeholder='Enter Floor Supervisor Name' autocomplete='off'  class='technicianName' /></div>";
	        	else if(ques_process.process[i].id==7)
	        		techDiv = "<div style='margin-bottom:10px;'><input type='text' value='"+ques_process.process[i].technician_name+"' name='technicianName' style='width:100%;padding:10px;' placeholder='Enter Inspector Name' autocomplete='off'  class='technicianName' /></div>";
	        	else
	        		techDiv = "";

	        	techDiv +="<input type='hidden' value='"+ques_process.type_id+"' name='dssID'/>"
	        	techDiv +="<input type='hidden' value='"+ques_process.process[i].id+"' name='processID'/>"

	        	processData += '<div id='+ques_process.process[i].id+' class="panel-collapse collapse"><form name="frm_'+ques_process.process[i].id+'" id="frm_'+ques_process.process[i].id+'" onsubmit="return submitQuestionForm(this.id)" method="post" class="frmQuestions"><div class="panel-body clearfix">\
					        	<input type="hidden" name="auditID" value="'+localStorage.getItem("auditID")+'">\
					        	<h4>'+ques_heading+'</h4>'+techDiv;

				if (ques_process.process[i].has_text == 0)
					processData += '<input type="hidden" name="action" value="answersList">';
				else 
					processData += '<input type="hidden" name="action" value="customersList">';

                for (var k=0;k<ques_process.process[i].headings[j].questions.length;k++) {
                	qCount++;
		        	radioID = ques_process.process[i].headings[j].questions[k].question_id;

		        	yes = "";
		        	yes1 = "";
		        	no = "";
		        	no1 = "";


		        	marks = parseInt(ques_process.process[i].headings[j].questions[k].marks);
		        	answer = parseInt(ques_process.process[i].headings[j].questions[k].answer);

		        	if(answer>0){
		        		yes = " active ";
		        		yes1 = " checked ";
		        	}
		        	else if(answer==0){
		        		no = " active ";
		        		no1 = " checked ";
		        	}

		        if  (ques_process.process[i].has_text == 0) {
		        	txtRemarks = ques_process.process[i].headings[j].questions[k].remarks;
		        		processData += '<div class="panel panel-default"><input type="hidden" name="questionID[]" value="'+radioID+'"><input type="hidden" name="dealerScore[]" value="'+answer+'" class="dealerscore"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ ques_process.process[i].headings[j].questions[k].question+'<span class="label ans_label"><blockquote class="saveBtn-wrapper"><div class="btn-group" data-toggle="buttons">\
                	<label class="saveBtn btn btn-ques-radio yes '+yes+'">\
                	<input class="ques-radioBtns" type="radio" '+yes1+' id="sal" value="'+marks+'" name='+radioID+'/>YES</label><label class="saveBtn btn btn-ques-radio no '+no+' bttn">\
                	<input class="ques-radioBtns" type="radio" '+no1+' id="sal1" value="0" name='+radioID+' />NO</label>\
                	<label class="saveBtn btn btn-ques-reset resetbttn"><input class="ques-radioBtns" type="radio" id="" value="reset" name="1">RESET </label></div></span></p><p><label class="edit-labels">Max. Score : </label><span class="">'+ques_process.process[i].headings[j].questions[k].marks+'</span></p><p><label class="edit-labels">Dealer Score: </label><span class="changable-val">'+ques_process.process[i].headings[j].questions[k].answer+'</span></p><p><label class="edit-labels-textarea">Remarks :</label><textarea colspan="4" rowspan="2" name="auditRemarks[]" class="auditRemarks">'+txtRemarks+'</textarea></p></blockquote></div></div>';
                } else {

                	customer_name = ques_process.process[i].headings[j].questions[k].customer_name;
                	customer_phone = ques_process.process[i].headings[j].questions[k].customer_phone;
                	dealer_score = ques_process.process[i].headings[j].questions[k].answer;

                	if(customer_phone=="0"){
                		checked = "checked";
                		readonlyTxtClass = "phone_disable";
                		readonlyTxt = "readonly";
                	}
                	else{
                		checked = "";
                		readonlyTxtClass = "";
                		readonlyTxt = "";
                	}

                	


                	processData += '<div class="panel panel-default"><input type="hidden" name="questionID[]" value="'+radioID+'"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ ques_process.process[i].headings[j].questions[k].question+'<span class="label ans_label"><blockquote class="clearfix saveBtn-wrapper"><div class="btn-group padding-zero col-md-6 col-sm-6 col-xs-12">\
                	<div class="customer_details_blk"><label for="name">Customer Name</label><input id="" value="'+customer_name+'" class="input_customerName" name="txtCustName[]" type="text"></div><div><label for="phone">Customer Mobile</label><input id="" value="'+customer_phone+'" class="input_customer_details '+readonlyTxtClass+'" '+readonlyTxt+' name="txtCustPhone[]" type="tel"><input class="mobNumber_check" '+checked+' type="checkbox" name="txtPhoneCheck" id="chk'+k+'" value=""><label class="mob_not_aval" for="chk'+k+'">Mobile No not available</label></div></span></p><p><label class="edit-labels">Max. Score : </label><span class="">'+ques_process.process[i].headings[j].questions[k].marks+'</span></p><label>Dealer Score : </label> <select class="customer_marks dealerscore'+k+'" name="txtDealerScore[]">'+loadMarks(dealer_score)+'</select><p><label class="edit-labels-textarea">Remarks :</label><textarea colspan="4" rowspan="2" name="auditRemarks[]" class="auditRemarks">'+ques_process.process[i].headings[j].questions[k].remarks+'</textarea></p></div></blockquote></div></div>';

                }
                	
                }

        			processData += '</div><button type="submit" class="btn btn-primary float-right">Save</button></div>';
	        }
	            
					processData += '</form></div>';
	    }
	    else if(ques_process.process[i].id==6 || ques_process.process[i].id==5 || ques_process.process[i].id==13){
	    	
			if(ques_process.process[i].id==6)
	    		selStr = "<a id='open-repair-sop' data-toggle='modal' data-target='#sop-repair-popup' href='#' data-placement='top'>SOP</a>\
	    		<div class='row'><div class='col-md-6 col-xs-6'>Select Customer 1</div><div class='col-md-6 col-xs-6'><select id='selProcess' class='form-control' onchange='fetchSOP(this,"+ques_process.process[i].id+")'>";
	    	else
				selStr = "<div class='row'><div class='col-md-6 col-xs-6'>Select Customer 1</div><div class='col-md-6 col-xs-6'><select id='selProcess' class='form-control' onchange='fetchSOP(this,"+ques_process.process[i].id+")'>";

			selStr +="<option value=''>Select</option>";
	    	for (var j=0;j<ques_process.process[i].headings.length;j++) {
				if(ques_process.process[i].headings[j].selected==1)
					bgcolor="background:#efefef;";
				else
					bgcolor="";

	    		selStr +="<option value='"+ques_process.process[i].headings[j].sub_heading_id+"' style='"+bgcolor+"' relCounter='"+ques_process.process[i].headings[j].relCount+"'>"+ques_process.process[i].headings[j].sub_heading_name+"</option>";
	    	} 

	    	selStr+="</select></div></div>";

        	processData += '<div id='+ques_process.process[i].id+' class="panel-collapse collapse"><div class="panel-body clearfix">';
			processData += selStr+'<p class="dataProcess"></p></div></div></div>';
	    }

	}
	return processData;
}

// function submitQuestionForm(objForm,x){
// 	// debugger;

// 	techObj = $("#"+objForm).find(".technicianName");

// 	//If technicianName textbox exists
// 	if(techObj.length)
// 		if(techObj){

// 			if($(techObj).val().trim()==""){
// 				alert($(techObj).attr('placeholder'));
// 				$(techObj).focus();
// 				$('html, body').animate({scrollTop: ($(window).scrollTop() - 180) + 'px'}, 300);
// 				return false;
// 			}

// 			// if(preg_match("/^[a-zA-Z0-9]+$/", $(techObj).val().trim()) != 1) {
// 			//     alert("Please enter correct Technician Name");
// 			// 	$(techObj).focus();
// 			// 	$('html, body').animate({scrollTop: ($(window).scrollTop() - 180) + 'px'}, 300);
// 			// 	return false;
// 			// }



// 		}


// 	ajaxifyAudit(objForm,changeColor,1)

// 	return false;
// }

function getParentQuestion(obj){

	myObj = $(obj).closest(".panel.panel-default").find(".panel-title");

	$(myObj).addClass("redFont");
	// debugger
	return myObj;
}
var techObj;
var vehcleNo;

function doValidate(objForm){

	var trueFlag = true;

	techObj = $("#"+objForm).find(".technicianName");
	vehcleNo = $("#"+objForm).find(".reg_no");

	//If technicianName textbox exists
	if(techObj.length)
		if(techObj){
			if($(techObj).val().trim()==""){
				bootbox.alert($(techObj).attr('placeholder'),function(){
					// $('html, body').animate({scrollTop: ($(window).scrollTop() - 180) + 'px'}, 300);
					
				}).on('hidden.bs.modal', function(event) {
				    $(techObj).closest(".panel-collapse.collapse").collapse('show');
					$(techObj).focus();
				});

				return false;					
			}
		}


	//If Vehicle Reg No textbox exists
	if(vehcleNo.length)
		if(vehcleNo){
			if($(vehcleNo).val().trim()==""){
				bootbox.alert($(vehcleNo).attr('placeholder'),function(){

				}).on('hidden.bs.modal', function(event) {
				    $(vehcleNo).focus();
					$(vehcleNo).closest(".panel-collapse.collapse").collapse('show');
				});
			
				return false;					

			}
		}


	rFalse = false;
	techYesOrNo = $("#"+objForm).find('[name="dealerScore[]"]');

	if(techYesOrNo.length)
	  $.each(techYesOrNo, function(i,x){
	  	obj = this;
	    if($(this).val() == 'NaN' || $(this).val() == ''){
	      trueFlag = false;
	      if(!($("#"+objForm).parent().hasClass("in")))
	      	$("#"+objForm).parent().addClass("in");
	      
	      		bootbox.alert("Please answer Question",function(){

				}).on('hidden.bs.modal', function(event) {
				      $(getParentQuestion($(obj))).focus();
				});
		  rFalse = true;
	      return false;
	    }
	  });

	if(rFalse)
		return false;


	/*
		techRemarks = $("#"+objForm).find('textarea[name="auditRemarks[]"]');

		if(techRemarks.length)
		  $.each(techRemarks, function(i,x){
		    if($(this).val() == "" && $(this).parent().find(".no").hasClass("active")){
		      trueFlag = false;
		      alert("Enter Please Remarks");
		      $(this).focus();
		      rFalse = true;
		      return false;
		    }
		  });
	*/
	techRemarks = $("#"+objForm).find('.no.active');

	if(techRemarks.length)
	  $.each(techRemarks, function(i,x){
	  	txtArea = $(this).closest("blockquote").find("textarea");
	  	obj = this;
	    if($(txtArea).val().trim() == ""){
	      trueFlag = false;
	      // alert("Please Enter Remarks for Question: "+$(this).find("input").attr("name"));
	      
	      		bootbox.alert("Please Enter Remarks",function(){

				}).on('hidden.bs.modal', function(event) {
				      $(getParentQuestion($(obj))).focus();
				});


	      // $(txtArea).focus();
	      rFalse = true;
	      return false;
	    }
	  });

	if(rFalse)
		return false;


	custName = $("#"+objForm).find('.input_customerName');

	if(custName.length){
		
		var valObj = $("#"+objForm).serializeObject();
		custflag = false;
		var nameCount=0;
		$.each(valObj['txtCustName[]'],function(i,v){
		  if(v != ""){
		  	nameCount++;
		    if(nameCount==2){
		    	custflag = true;
		    	return false;
		    }
		  }
		});
		if(!custflag){

	      		bootbox.alert("Please Enter atleast 2 Customer details",function(){
				}).on('hidden.bs.modal', function(event) {
			    	$(custName)[0].focus();
				});

			return false;
		}

		// Dropdown
		var customerMarksArr = $('select.customer_marks');
		var dropFlag = false;

		$.each(customerMarksArr, function(){
		  var curVal = parseInt($(this).val());
		  var custNameField = $(this).parent().find('.customer_details_blk input.input_customerName');
		  var custRemarks = $(this).next().find('textarea.auditRemarks');
		  if(curVal){
			  if(custNameField[0].value == ""){
			    dropFlag = true;

	      		bootbox.alert("Please Enter Customer Name",function(){
				}).on('hidden.bs.modal', function(event) {
			    	$(custNameField[0]).focus();
				});

			    return false;
			  }
			  if(curVal < 15){
			    if(custRemarks.val() == ""){
			      dropFlag = true;

		      		bootbox.alert("Enter Remarks",function(){
					}).on('hidden.bs.modal', function(event) {
				    	custRemarks.focus();
					});

			      return false;



			    }
			  }
		  }
		});

		if(dropFlag) return false;



	  $.each(custName, function(i,x){
	  	var checkBox = $(this).parent().next().find('.mobNumber_check');
	  	if($(this).val() != ""){
	  		if(!checkBox.is(':checked')){
	  			if(checkBox.prev().val().startsWith('0') || checkBox.prev().val() == "") {
	  				trueFlag = false;

		      		bootbox.alert("Enter Valid Mobile Number",function(){
					}).on('hidden.bs.modal', function(event) {
				    	checkBox.prev().focus();
					});

	  				rFalse = true;
	  				return false;
	  			}
	  		}
	  	}
	  });
		
	}

	return trueFlag;
}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

function submitQuestionForm(objForm,x){
	// debugger;






	
	trueFlag = doValidate(objForm);
	if(trueFlag){
		ajaxifyAudit(objForm,changeColor,1);
	}

	return false;
}


function loadMarks(x){
	options = "";
	if(x==undefined)
		x=0;

	for(marks=0;marks<=20;marks++){
		if(marks==x)
			options +="<option value='"+marks+"' selected>"+marks+"</option>";
		else
			options +="<option value='"+marks+"' >"+marks+"</option>";

	}

	return options;
}

function changeColor(formObj){

	selObj = $("#"+formObj).closest(".panel-body").find("select");
	// debugger;

	if(selObj.length){

		selOptionObj = selObj[0].options[selObj[0].options.selectedIndex];
		selVal = $(selOptionObj).val();
		selText = $(selOptionObj).text();

		if(!($(selOptionObj).text().indexOf("- (Reg No:")>0)){

			$(selOptionObj).text(selText+" - (Reg No: "+$("#"+formObj+" .reg_no")[0].value+")");
			relCount = $(selObj).find('option[value='+selVal+']').length+1;

			$(selOptionObj).after($('<option>', {
			    value: selVal,
			    text: selText
			}).attr("relCounter",relCount));



			$(selOptionObj).css("background","#efefef");
		}
		else{
			selText = selText.substring(0,selText.indexOf(" - (Reg No: "));
			if(selText!="")
				$(selOptionObj).text(selText+" - (Reg No: "+$("#"+formObj+" .reg_no")[0].value+")");

		}

		//To get RelCount
		// alert($(selObj).find('option[value='+selVal+']').length);
		// alert($(selObj).find('option:selected').text());

		// $("#"+$(selObj).attr("id")+" option").eq(selObj[0].options.selectedIndex).after($('<option>', {
		//     value: selVal,
		//     text: selText
		// }));
		
	}
}

var subHeadingID;

function fetchSOP(selObj,processID){

	// open-repair-sop

	// if(processID==6)
	// 	$("#open-repair-sop").click();


	relCounter = $(selObj.options[$(selObj)[0].selectedIndex]).attr("relCounter");


	subHeadingID = $(selObj).val();

	if(subHeadingID!=""){

		appendObj = $(selObj).parents(".panel-body.clearfix").find(".dataProcess");
		showLoading();


		if(processID==6)
			url = host+"index.php?action=getrepairsopdata&subHeadingID="+subHeadingID+"&audit_id="+localStorage['auditID']+"&processID="+processID+"&typeID="+localStorage['type_id'];
		
		else if(processID==5)
			url = host+"index.php?action=getSOPAdherence&modelID="+subHeadingID+"&audit_id="+localStorage['auditID']+"&processID="+processID+"&typeID="+localStorage['type_id']+"&relCounter="+relCounter;
		
		else if(processID==13)
			url = host+"index.php?action=getSOPAdherence&modelID="+subHeadingID+"&audit_id="+localStorage['auditID']+"&processID="+processID+"&typeID="+localStorage['type_id']+"&relCounter="+relCounter;



	  	$.getJSON( url, function( data ) {
	       $(appendObj).html("");
	  		//debugger;
	  		if(localStorage.getItem("subStatus")==1) {
	  			// console.log(data);
	  			// C(processID)
	        	$(appendObj).append(create_process_ques(data, processID));
	  		} else {
	  			// console.log("non-edit");
	  			
				$(".repair-sop-tbody").html("")
	  			if(processID==6){
	  				for(sop=0;sop<data.questions.length;sop++) {

		  				//console.log(data.questions[sop].question);
		  				repair_sop = '<tr><td>'+(sop+1)+'</td><td>'+data.questions[sop].question+'</td></tr>';

	                    $(".repair-sop-tbody").append(repair_sop);
		  			}
		  			sop_url = host+"index.php?action=getSOPAdherence&subHeadingID="+subHeadingID+"&audit_id="+localStorage['auditID']+"&processID="+processID+"&typeID="+localStorage['type_id']+"&relCounter="+relCounter;
		  			console.log(sop_url);
		  			$.getJSON(sop_url, function(sop_data) {
		  				console.log(sop_data);
		  				$(appendObj).append(edit_processQuestions(sop_data,processID));
		  				hideLoading();
		  				var maxMarks = max_dealerScore;
		  				splitArr = [0]
		  				for(k=0; k<maxMarks; k+10) {
		  					k = k+10;
		  					splitArr.push(k)
		  					
		  				}
		  				// console.log(splitArr)
		  				$('.single-slider').jRange({
			                from: 0,
			                to: maxMarks,
			                step: 10,
			                scale: splitArr,
			                format: '%s',
			                width: 300,
			                showLabels: true,
			                onstatechange: function(val,obj){
			                	console.log(val);
			                	console.log(obj);
			                	$("#modalBox-dealerScore").text(val);
								$("#modalBox-dealerScore_value").val(val);

								// TODO -- Optimise
								thisVal = $(obj).val();

								if(thisVal=="reset")
									thisVal = "";


								$(obj).closest(".panel").find(".changable-val").text(thisVal);
								$(obj).closest(".panel").find(".dealerscore").val(thisVal);


								var adh = 0;//parseInt($(obj).parents(".panel").find(".span_adh").text());
								var total_score = $(obj).parents(".panel").find(".span_weightage").text();


								myObj = $(obj).closest(".panel-body").find(".changable-val");
								total = 0;

								$.each(myObj,function(){

									questionVal = $(this).text() ;

									if(questionVal==NaN || questionVal=="NaN" || questionVal == undefined || questionVal == ""	)
										questionVal = 0
									
										total += parseFloat(questionVal);

								});

								// //alert(total)

								if(total_score=="")
									$total_score = 0

								if(total=="")
									$total = 0

								if(total==NaN)
									total=0;

								var adherence = (total/total_score)*100

								
								$(obj).parents(".panel").find(".span_total").text(total)
								$(obj).parents(".panel").find(".span_adh").text(adherence.toFixed(2)+ "%");

			                }
			            });

		  			// });

		  				// debugger;
		  				// if($(appendObj).find(".active input").length>=1)
		  				// 	$(appendObj).find(".active input")[0].click();
		  				// else
		  				// 	$(appendObj).find(".resetbttn input")[0].click();
		  			});
				}

	  			if(processID!=6){
	        		$(appendObj).append(edit_processQuestions(data,processID));
	        		hideLoading();
	        	}



	        	
	  		}
	  		

	    });
  	}
  	else{
  		$(appendObj).html("");
  	}
}

function edit_processQuestions(ques_process,processID) {

	if(ques_process.sub_heading == undefined) {
		var ques_heading = "";
	} else {
		var ques_heading = ques_process.sub_heading;
	}

	// alert(processID)

	qCount = 0;

	 techDiv = "<div style='margin-bottom:10px;'><input type='text' value='"+ques_process.technician_name+"' name='technicianName' style='width:100%;padding:10px;' placeholder='Enter Technician Name' autocomplete='off' class='technicianName' /></div>";
	 reg_no = "<div style='margin-bottom:10px;'><input type='text' value='"+ques_process.reg_no+"' name='reg_no' style='width:100%;padding:10px;' placeholder='Vehicle Registration Number or Last 5 Digit of Chassis Number' autocomplete='off' class='reg_no' /></div>";
	  		// alert(ques_process.technician_name)
	  		
	        	id_modelID = "";
	        	id_subHeadingID = "";

	        	//subHeadingID is the selectObj value

	        	if(processID=="5" || processID=="13"){
	        		id_modelID = subHeadingID;
	        	}

	        	if(processID=="6"){
	        		id_subHeadingID = subHeadingID;
	        	}
	// debugger;
	//Adding a textarea for OThers dropdown on SOP Adherance
	if(subHeadingID=="45" && processID=="6"){
		if(ques_process.comments==undefined)
			commentTxt = "";
		else
			commentTxt = ques_process.comments;

		othersData = "<div style='margin-bottom:10px;'><textarea name='commentsArea' style='width:100%;padding:10px;resize: none;' placeholder='Comment Here' class='comments'>"+commentTxt+"</textarea></div>";
	}
	else{
		othersData = "";
	}


	processData = '<div id='+ques_process.sub_heading_id+' class="panel-collapse in"><form name="frm_process" id="frm_process_'+processID+'" onsubmit="return submitQuestionForm(this.id)" method="post" class="frmQuestions"><div class="panel-body clearfix">\
		        	<input type="hidden" name="action" value="answersList">\
		        	<input type="hidden" name="relCounter" value="'+ques_process.relCount+'">\
		        	<input type="hidden" name="auditID" value="'+localStorage.getItem("auditID")+'">\
		        	<input type="hidden" name="dssID" value="'+localStorage.getItem("type_id")+'">\
		        	<input type="hidden" name="processID" value="'+processID+'">\
		        	<input type="hidden" name="modelID" value="'+id_modelID+'">\
		        	<input type="hidden" name="subHeadingID" value="'+id_subHeadingID+'">\
		        	'+techDiv+'\
		        	'+reg_no+'\
		        	'+othersData+'\
		        	<h4>'+ques_heading+'</h4>';

    for (var k=0;k<ques_process.questions.length;k++) {
    	qCount++;
    	radioID = ques_process.questions[k].question_id;

    	yes = "";
    	yes1 = "";
    	no = "";
    	no1 = "";
    	na = "";
    	na1 = "";


    	marks = parseFloat(ques_process.questions[k].marks);
    	answer = parseFloat(ques_process.questions[k].answer);
    	isNA = parseFloat(ques_process.questions[k].isNA);

    	// if(answer>0){
    	// 	yes = " active ";
    	// 	yes1 = " checked ";
    	// }
    	// else if(answer==0){
    	// 	no = " active ";
    	// 	no1 = " checked ";
    	// }


    	if(isNA=="1"){
    		yes = " active ";
    		yes1 = " checked ";
    	}
    	else if(isNA=="2"){
    		no = " active ";
    		no1 = " checked ";
    	}
    	else if(isNA=="3"){
    		na = " active ";
    		na1 = " checked ";
    	}




    	boxData = "";

    	if(processID == 6 && ques_process.questions[k].isRanger==1) {
    		if(ques_process.questions[k].answer == "") {
    			ques_process.questions[k].answer = 0;
    		}

    		// TODO -- This code needs to verify --
    		// boxData = '<div class="panel panel-default"><input type="hidden" name="questionID[]" value="'+radioID+'"><input type="hidden" name="dealerselect[]" value="" class="dealerselect"><input type="hidden" name="dealerScore[]" value="'+answer+'" class="dealerscore"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ ques_process.questions[k].question+'<span class="label ans_label"><div class="row"><input type="button" name="repairCheckSheet" data-placement="top" href="#" data-target="#sop-repair-popup" data-toggle="modal" value="Repair Check Sheet" class="pull-right btn btn-success" style="margin-right:30px;"></div><input class="ques-radioBtns dealerscore_range" type="range" name="rangeInput" min="0" step="10" max="'+marks+'" value="'+ques_process.questions[k].answer+'"><blockquote class="saveBtn-wrapper"><div class="btn-group" data-toggle="buttons">\
    			// <p><label class="edit-labels">Max. Score : </label><span class="">'+ques_process.questions[k].marks+'</span></p><p><label class="edit-labels">Dealer Score: </label><span class="changable-val">'+ques_process.questions[k].answer+'</span></p></blockquote></div></div>';
    		max_dealerScore = ques_process.questions[k].marks;
    		processData += '<div class="panel panel-default"><input type="hidden" name="questionID[]" value="'+radioID+'"><input type="hidden" name="dealerselect[]" value="'+isNA+'" class="dealerselect"><input type="hidden" name="dealerScore[]" value="'+answer+'" class="dealerscore" id="modalBox-dealerScore_value"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ ques_process.questions[k].question+'<span class="label ans_label">';
    		
    		if(!(subHeadingID=="45" && processID=="6"))
    			processData += '<div class="row"><input type="button" name="repairCheckSheet" data-placement="top" href="#" data-target="#sop-repair-popup" data-toggle="modal" value="Repair Check Sheet" class="pull-right btn btn-success" style="margin-right:30px;"></div>';
    		
    		processData += '<input class="single-slider ques-radioBtns" type="hidden" value="'+ques_process.questions[k].answer+'"/><blockquote class="saveBtn-wrapper" style="margin-top:20px;"><div class="btn-group" data-toggle="buttons" style="width:100%">';
    		processData += '<p><label class="edit-labels">Max. Score : </label><span class="">'+ques_process.questions[k].marks+'</span></p><p><label class="edit-labels">Dealer Score: </label><span class="changable-val" id="modalBox-dealerScore">'+ques_process.questions[k].answer+'</span></p><p><label class="edit-labels-textarea">Remarks :</label><textarea colspan="4" rowspan="2" name="auditRemarks[]" class="auditRemarks">'+ques_process.questions[k].remarks+'</textarea></p></blockquote></div></div>';

    			// <input class="single-slider ques-radioBtns dealerscore_range" type="range" name="rangeInput" min="0" step="10" max="'+marks+'" value="'+ques_process.questions[k].answer+'">

    		
    	} else {
    		boxData = '<div class="panel panel-default"><input type="hidden" name="questionID[]" value="'+radioID+'"><input type="hidden" name="dealerselect[]" value="'+isNA+'" class="dealerselect"><input type="hidden" name="dealerScore[]" value="'+answer+'" class="dealerscore"><div class="panel-heading"><p class="panel-title" tabindex="1">'+qCount + ". "+ ques_process.questions[k].question+'<span class="label ans_label"><blockquote class="saveBtn-wrapper"><div class="btn-group" data-toggle="buttons">\
	    	<label class="saveBtn btn btn-ques-radio yes '+yes+'">\
	    	<input class="ques-radioBtns" type="radio" '+yes1+' id="sal" value="'+marks+'" name='+radioID+'  rel="yesBtn"/>YES</label><label class="saveBtn btn btn-ques-radio no '+no+' bttn">\
	    	<input class="saveBtn ques-radioBtns" type="radio" '+no1+' id="sal1" value="0" name='+radioID+'  rel="noBtn"/>NO</label>';

	    	if(processID == 5)
	    		boxData +='<label class="saveBtn btn btn-ques-radio yes '+na+' btngrey"><input class="ques-radioBtns" rel="naBtn" type="radio" '+na1+' id="sal" value="'+marks+'" name='+radioID+' />N.A.</label>';

	    	boxData += '<label class="btn btn-ques-reset resetbttn"><input class="ques-radioBtns" type="radio" id="" value="0" name="1" rel="resetBtn">RESET </label></div></span></p><p><label class="edit-labels">Max. Score : </label><span class="">'+ques_process.questions[k].marks+'</span></p><p><label class="edit-labels">Dealer Score: </label><span class="changable-val">'+ques_process.questions[k].answer+'</span></p><p><label class="edit-labels-textarea">Remarks :</label><textarea colspan="4" rowspan="2" name="auditRemarks[]" class="auditRemarks">'+ques_process.questions[k].remarks+'</textarea></p></blockquote></div></div>';	
    	
    	}

    	processData += boxData;
    }

    	if(processID==5 || processID==6 || processID==13){
    		btnType = "button"
    		submitAction = "onclick='alertMsg(this.id)' id='"+processID+"'"
    	}
    	else{
    		btnType = "submit";
    		submitAction = "";

    	}

		processData += '</div><button type="'+btnType+'" class="btn btn-primary float-right" '+submitAction+'>Save</button></div>';

		processData += '</form></div>';
	
		return processData;
}

function alertMsg(formID){

	if($("#frm_process_"+formID).closest('div.panel-body').find('select option[style^="background"]').length < 1){
		box = bootbox.alert("Please check minimum 2 vehicles",function(){
				box.modal('hide');
				submitQuestionForm("frm_process_"+formID);
			});
	}
	else{
		submitQuestionForm("frm_process_"+formID);
	}
		// alert("Please check minimum 2 vehicles");
}

function updateTextInput(val) {
	console.log(val)
}

function saveAllForms(){

	frms = $(".frmQuestions");
	total = frms.length;
	var ajax_calls = [];
	rtnType = true;


	$(frms).each(function(index) {

		if(!(doValidate($(this).attr("id")))){

			rtnType = false;
			return false;
		}
		
	});

	if(rtnType==false)
		return false;

	showLoading();

	$(frms).each(function(index) {
		// showLoading();
		// //alert(index)
		// if (index === total - 1){
		// 	ajaxifyAudit(frms[index].id,changeColor)
		// }
		// else{
		// 	ajaxifyAudit(frms[index].id,hideLoading,1)
			
		// }

		ajax_calls.push(ajax_caller({
	        formObj: frms[index].id,
	        method: 'POST',
	        successfunction:changeColor
	    }))


	});

	$.when.apply(this, ajax_calls).done(function() {
	    // Event to be fired after all ajax calls complete
	    hideLoading();
	});


}




var ajax_caller = function(data) {

  formObj = data.formObj;
  successfunction = data.successfunction;

  var values = $("#"+formObj).serialize();
  testURL = host+"index.php";

  return $.ajax({
      url: testURL,
      type: "post",
      data: values
  });

}



$(document).ready(function(){

	$(document).on("change", ".ques-radioBtns", function(){

		myObj = getParentQuestion($(this));
		$(myObj).removeClass("redFont");
		$(myObj).blur();

		if($(this).attr("rel")=="naBtn")
			$(this).closest(".panel").find(".dealerselect").val("3");
		else if($(this).attr("rel")=="yesBtn")
			$(this).closest(".panel").find(".dealerselect").val("1");
		else if($(this).attr("rel")=="noBtn")
			$(this).closest(".panel").find(".dealerselect").val("2");
		else if($(this).attr("rel")=="resetBtn")
			$(this).closest(".panel").find(".dealerselect").val("");


		var cur_value = $(this).val();
		//pid = $(this).closest(".saveBtn-wrapper").attr("id");

		thisVal = $(this).val();

		if(thisVal=="reset")
			thisVal = "";


		$(this).closest(".panel").find(".changable-val").text(thisVal);
		$(this).closest(".panel").find(".dealerscore").val(thisVal);

		var resPos = $(this).closest(".panel").find("#sal").val();

		var adh = 0;//parseInt($(this).parents(".panel").find(".span_adh").text());
		var total_score = $(this).parents(".panel").find(".span_weightage").text();


		myObj = $(this).closest(".panel-body").find(".changable-val");
		total = 0;

		$.each(myObj,function(){

			questionVal = $(this).text() ;

			if(questionVal==NaN || questionVal=="NaN" || questionVal == undefined || questionVal == ""	)
				questionVal = 0
			
				total += parseFloat(questionVal);

		});

		//alert(total)

		if(total_score=="")
			$total_score = 0

		if(total=="")
			$total = 0

		if(total==NaN)
			total=0;

		var adherence = (total/total_score)*100

		
		$(this).parents(".panel").find(".span_total").text(total)
		$(this).parents(".panel").find(".span_adh").text(adherence.toFixed(2)+ "%")


	});
});


$(document).on('change', '.customer_marks', function(){
	
	customerMarks($(this));


})

$(document).on('click', '.clickable-dummy', function(){
	
	// alert($(".pointer-label")[1].innerHTML);
		myObj = getParentQuestion($(this));
		$(myObj).removeClass("redFont");

})


function customerMarks(obj){

	var selLength = $(".customer_marks").length

	total = 0;
	customerCount =0;

	for(x=0;x<selLength;x++) {
		var dealerscore =  $(".dealerscore"+x).val();
		if(dealerscore==NaN)
			dealerscore =0;

		if(dealerscore>=1){
			customerCount++;
			total += parseInt(dealerscore);
		}
	}
	total = total/customerCount;

	if(isNaN(total))
		total=0;

	//alert(total)

	$(obj).parents(".panel").find(".span_total").text(total);
	weightage = parseFloat($(obj).parents(".panel.panel-default.clearfix").find(".span_weightage").html())
	adherence = $(obj).parents(".panel.panel-default.clearfix").find(".span_adh")
	//debugger;
	$(adherence).text(((total/weightage)*100).toFixed(2) +"%")
	
}



function getManpower() {

	showLoading();

	//txt_row
	$("#audit-manpower").css("display", "block");
	auditID = localStorage['auditID'];
	// alert(auditID)
	$("#auditID").val(auditID);
	


	if(localStorage.getItem("subStatus")!=1 || localStorage.getItem("subStatus")==undefined ){
		    $("#saveBtnWrapper").append('<button type="submit" class="btn btn-primary submit-btn-edit col-md-6 col-xs-12" >Save</button>');
	}


	$.ajax({ 
        type: 'GET', 
        url: host+ 'index.php?action=getManpower&auditID='+localStorage.getItem("auditID"), 
        dataType: 'json',
        success: function (manpower_data, status) {
                    hideLoading();
                    $.each($(".cell_1"),function(){
                    	//$(this).text();
                    	str = ($(this).text().replace(": ", ":<br/><span class='greenFont'>("));
                    	str += ")</span>";

                    	$(this).html(str);

                    });

                    if(manpower_data.status == 0) {
                    	return;
                    } else {

                    	$("#txt_AMPV").val(manpower_data.AMPV).keyup()
	                    $("#txt_AMSV").val(manpower_data.AMSV).keyup()

	                    $("#txt_row1").val(manpower_data.row_1).keyup()
	                    $("#txt_row2").val(manpower_data.row_2).keyup()
	                    $("#txt_row3").val(manpower_data.row_3).keyup()
	                    $("#txt_row4").val(manpower_data.row_4).keyup()
	                    $("#txt_row5").val(manpower_data.row_5).keyup()
	                    $("#txt_row6").val(manpower_data.row_6).keyup()
	                    $("#txt_row7").val(manpower_data.row_7).keyup()
	                    $("#txt_row8").val(manpower_data.row_8).keyup()
	                    $("#txt_row9").val(manpower_data.row_9).keyup()
	                    $("#txt_row10").val(manpower_data.row_10).keyup()
	                    $("#txt_row11").val(manpower_data.row_11).keyup()
	                    $("#txt_row12").val(manpower_data.row_12).keyup()
	                    $("#txt_row13").val(manpower_data.row_13).keyup()
	                    $("#txt_row14").val(manpower_data.row_14).keyup()
	                    $("#txt_row15").val(manpower_data.row_15).keyup()
					     
					    // $("#txt_AMPV").keyup();
					    // $("#txt_AMSV").keyup();
					    $(".row1.rowTemplate input, .row2.rowTemplate input, .row2.rowTemplate input, .row3.rowTemplate input, .row4.rowTemplate input, .row5.rowTemplate input, .row6.rowTemplate input, .row7.rowTemplate input, .row8.rowTemplate input, .row9.rowTemplate input, .row10.rowTemplate input, .row11.rowTemplate input, .row12.rowTemplate input, .row13.rowTemplate input, .row14.rowTemplate input, .row15.rowTemplate input").keyup();	

					    if(manpower_data.subStatus == "1"){

	                    	$("#txt_AMPV").attr("disabled","disabled");
		                    $("#txt_AMSV").attr("disabled","disabled");

		                    $("#txt_row1").attr("disabled","disabled");
		                    $("#txt_row2").attr("disabled","disabled");
		                    $("#txt_row3").attr("disabled","disabled");
		                    $("#txt_row4").attr("disabled","disabled");
		                    $("#txt_row5").attr("disabled","disabled");
		                    $("#txt_row6").attr("disabled","disabled");
		                    $("#txt_row7").attr("disabled","disabled");
		                    $("#txt_row8").attr("disabled","disabled");
		                    $("#txt_row9").attr("disabled","disabled");
		                    $("#txt_row10").attr("disabled","disabled");
		                    $("#txt_row11").attr("disabled","disabled");
		                    $("#txt_row12").attr("disabled","disabled");
		                    $("#txt_row13").attr("disabled","disabled");
		                    $("#txt_row14").attr("disabled","disabled");
		                    $("#txt_row15").attr("disabled","disabled");

		                    $("#saveBtnWrapper").remove();
					    }
					    	

                    }



                    
            },
        error: function(e){
            hideLoading();
            console.log(e);
        }
    });



}

var total_maxScore;
function getData($scope, $http) {
	showLoading();
	$http.get(host+'index.php?action=getjobrole').success(function(response){

		$scope.data = response;
		// console.log($scope.data.max_score_total);
		total_maxScore = $scope.data.max_score_total;

		// max_score_total
		$(".txtMaxScore").text($scope.data.max_score_total)

		cal_totalScore(total_maxScore)
		

		// hideLoading();

	});



}


angular.module('myApp',[]).directive('myRepeatDirective',function(){})


function toolsAndEquipment() {
	$.ajax({ 
        type: 'GET', 
        url: host+ 'index.php?action=getSubCategories&id=3&auditID='+localStorage['auditID'], 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (tools_and_equipment, status) {
        			crrateRibbons(tools_and_equipment)
				        		
            },
        error: function(e){
            console.log(e);
        }
    });
}

function crrateRibbons(tools_and_equipment) {
	var colorArr = [{'bgcolor':'#E74C3C'}, {'bgcolor':'#8E44AD'}]

	var dash = tools_and_equipment.details;

	// var dealer_audit_dashboard
	for(var p=0; p<dash.length; p++) {
		var dealer_audit_dashboard = '<div class="col-sm-3"><div class="circle-tile" onclick="goSubcategories('+dash[p].type_id+')"><a href="#"><div class="circle-tile-heading" style="background: '+colorArr[p].bgcolor+' "><i class="fa '+dash[p].icon_name+' fa-fw fa-3x"></i></div></a><div class="circle-tile-content" style="cursor:pointer;background: '+colorArr[p].bgcolor+' "><div class="circle-tile-description text-faded"><h4>'+dash[p].type_name+'</h4></div><div class="circle-tile-number text-faded dealerAuditDashboard">';

		for(var q=0;q<dash[p].legends.length;q++) {

			if((dash[p].legends[q].score == 0) || (dash[p].legends[q].score == "")) {
				dash[p].legends[q].score = "-";
			}

            dealer_audit_dashboard +='<p>'+dash[p].legends[q].type+' : <span>'+dash[p].legends[q].score+'</span></p>';
        }

        dealer_audit_dashboard += '</div><a onclick="goSubcategories('+dash[p].type_id+')" class="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div></div>';

        
        $("#audit-questionnaire-area").append(dealer_audit_dashboard)
	}

}

function goSubcategories(subCatID) {
	window.location.href = "audit-report-subcatagories.html?subcategoryid="+subCatID;
}


$(document).on('change', '.mobNumber_check', function(){
	if(this.checked) {
        $(this).parent().find('.input_customer_details').attr('readonly', 'readonly').addClass('phone_disable').val("");

    } else {
    	$(this).parent().find('.input_customer_details').removeAttr('readonly').removeClass('phone_disable').focus();
    }
})


function manpowerReturn(data) {
	//alert(data);
}

function showDealerInfo() {

    var txtDealerName =  localStorage.getItem("txtDealerName")
    var txtAuditID = localStorage.getItem("txtAuditID")
    var txtDealerCode = localStorage.getItem("txtDealerCode")
    var txtAuditDate = localStorage.getItem("txtAuditDate")
    

    $("#dealer_name").html("<strong>Dealer Name: </strong>"+  txtDealerName)
    $(".dealerCode").html("<strong>Dealer Code: </strong>"+  txtDealerCode)

}

