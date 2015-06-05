if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}

var activeObj;
var deleteObj;
var jsonObjHeading;
var jsonObjQuestion;

var questionObj;
var subHeadingObj;

var jsonObj;


function loadquestionnaireData(path) {
	showLoading();
	$.ajax({ 
		type: 'GET', 
		url: path, 
		data: { get_param: 'value' }, 
		dataType: 'json',
		success: function (ques_process, status) {

					jsonObj = ques_process;
					create_process_ques_edit(ques_process);
					
					hideLoading();
		        },

		error: function(e){
		    console.log(e);
		    hideLoading();
		}
	});
}


var getSubcategories = function(prodId) {
	// alert(prodId)
	$.ajax({
		type : 'GET',
		url : admin_host+ 'index.php?action=subcat&id=3&auditID='+prodId,
		dataType : 'json',
		success : function(subcategories, status) {
					console.log(subcategories);
					create_subcategories(subcategories)
		},
		error : function(e) {
			console.log(e)
		}
	})
}

var create_subcategories = function(subcategories) {
	var colorArr = [{'bgcolor':'#E74C3C'}, {'bgcolor':'#8E44AD'}]

	var dash = subcategories.details;

	for(var p=0; p<dash.length; p++) {
		var dealer_audit_dashboard = '<div class="col-sm-3"><div class="circle-tile" onclick="goSubcategories('+dash[p].type_id+')"><a href="#"><div class="circle-tile-heading" style="background: '+colorArr[p].bgcolor+' "><i class="fa '+dash[p].icon_name+' fa-fw fa-3x"></i></div></a><div class="circle-tile-content" style="cursor:pointer;background: '+colorArr[p].bgcolor+' "><div class="circle-tile-description text-faded"><h4>'+dash[p].type_name+'</h4></div><div class="circle-tile-number text-faded dealerAuditDashboard">';

		for(var q=0;q<dash[p].legends.length;q++) {

			if((dash[p].legends[q].score == 0) || (dash[p].legends[q].score == "")) {
				dash[p].legends[q].score = "-";
			}

            dealer_audit_dashboard +='<p>'+dash[p].legends[q].type+' : <span>'+dash[p].legends[q].score+'</span></p>';
        }

        dealer_audit_dashboard += '</div><a onclick="goSubcategories('+dash[p].type_id+')" class="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div></div>';

        
        $("#admin-questionnaire-area").append(dealer_audit_dashboard)
	}

}

function goSubcategories(subCatId) {
	// alert(typeID)
	window.location.href = "admin-report-subcatagories.html?subCatId="+subCatId;
}


$(document).ready(function(){
	var categoryID = localStorage['type_id'] - 1;

	var auditCategoreis = [{"category":"Process"},{"category":"Manpower"},{"category":"Tools and Equipment"},{"category":"Infrastructure and CI Elements"}]

	var breadcrumb = '<ul class="crumbs">\
                        <li class="first"><a href="dss.html" style="z-index:9;"><span></span>Dealership Service Standards</a></li>\
                        <li><a href="admin-categories.html" style="z-index:8;">Audit Report</a></li>\
                        <li><a href="#" style="z-index:7;">'+auditCategoreis[categoryID].category+'</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrumb);
    
	var page_url = window.location.href;
    getParameterByName(page_url);
    prodId = getParameterByName('typeID');
    if((prodId == 1) || (prodId == 4)){
    	path = admin_host+ 'index.php?action=fetchQuestions&typeID='+prodId;	
    	loadquestionnaireData(path);
    } else if (prodId == 2) {
    	// alert("Manpower can not be edited");
    }
     else {
    	getSubcategories(prodId);
    }


    
    
    // alert('typeID='+prodId)


	$(document).on("change", ".ques-radioBtns", function(){

		var cur_value = $(this).val();

		$(this).closest(".panel").find(".changable-val").text($(this).val());
		$(this).closest(".panel").find(".dealerscore").val($(this).val());

		var resPos = $(this).closest(".panel").find("#sal").val();

		var adh = 0;//parseInt($(this).parents(".panel").find(".span_adh").text());
		var total_score = $(this).parents(".panel").find(".span_total").text();


		myObj = $(this).closest(".panel-body").find(".changable-val");
		total = 0;

		$.each(myObj,function(){

			questionVal = $(this).text() ;

			if(questionVal==NaN || questionVal=="NaN" || questionVal == undefined || questionVal == ""	)
				questionVal = 0
			

			total += parseInt(questionVal);

		});

		var adherence = (total/total_score)*100
		
		$(this).parents(".panel").find(".span_adh").text(adherence.toFixed(1)+ "%")

	});

	$(document).on('click', '.read_heading', function(){
		activeObj = $(this);

		var rel = $(this).attr('rel');
		$.each(jsonObj.process, function(i, v) {
	        if (v.id == rel) {
	        	jsonObjHeading = v;
	            var txtHeading = jsonObjHeading.type_name;
	            $("#txtHeading").val(txtHeading);

	            $("#txtHeadingID").val(rel);
	            return;
	        }
	    });
	});


	$(document).on('click', '.read_question', function(){

		questionObj = $(this);
		
		var rel = $(this).attr('rel');

		for(var p=0;p<jsonObj.process.length;p++) {
			for(var q=0; q<jsonObj.process[p].headings.length;q++) {
				for(var r=0; r<jsonObj.process[p].headings[q].questions.length; r++) {
					var quesObj = jsonObj.process[p].headings[q].questions[r];
					if(quesObj.question_id == rel) {
						jsonObjQuestion = quesObj
						$("#txtQuestionName").val(quesObj.question);
						$("#txtedit_marks").val(quesObj.marks);

						$("#txtQuestionID").val(rel);
						return;
					}
				}
			}
		}

	});
	
	$(document).on('click', '.delete_heading', function(){
		// alert("nlbj")
		var recID = $(this).attr('rel');
		deleteObj = $(this);
		//debugger;

		bootbox.confirm("Are you sure you want to delete this?", function(result) {
			//debugger;
			if(result) {
				$("#deleteRec #action").val("deleteheading_category");
				//alert(recID)
				$("#deleteRec #txtHeading").val(recID);
			
				$("#deleteRec").submit();

			} 
		}); 
	})

	$(document).on('click', '.delete_question', function(){
		var recID = $(this).attr('rel');

		delQuesObj = $(this);
		
		bootbox.confirm("Are you sure you want to delete this question?", function(result) {
			if(result) {

  				$("#deleteQues #action").val("deletequestion_category");
				$("#deleteQues #txtQuestionID").val(recID);
			
				$("#deleteQues").submit();
				
			} 
		}); 
	})

	$(document).on('click', '#editHeading', function(){
		$("#editHeadingForm").submit();
	});


	$(document).on('click', '#saveEditedQuestion', function(){
		$("#saveEditedQuestion").submit();
	});

	$(document).on('click', '.acc-heading', function(){
	    if($(this).hasClass('accordion-active')) {
	    	$(this).removeClass('accordion-active');
	    }
	    else {
	    	$(".acc-heading").removeClass('accordion-active');
	    	$(this).addClass('accordion-active');
	    	$(".accordion-active").parent().focus();
	    }
	});

});

function create_process_ques_edit(ques_process) {	

	var processData = '<div class="portlet-body"><div class="panel-group" id="accordion">';

	for (var i = 0; i < ques_process.process.length; i++) {

		processID = ques_process.process[i].id;

		processData += '<div class="panel panel-default"><div class="panel-heading clearfix question_accord_block"><div class="col-md-9 col-sm-9 col-xs-12"><h4 class="panel-title audit-accordian adminQues_heading">\
		<a class="acc-heading" data-toggle="collapse" data-parent="#accordion" href="#'+ques_process.process[i].id+'" class="collapsed adminQues_heading">'+ques_process.process[i].type_name+'</a>\
		</h4><p class="adminQues_totalScore">Total Score : <span class="bold">';

		if(!(processID=="5" || processID=="6" || processID=="13" || processID == "12"))
			processData += ques_process.process[i].total;

		if(processID == "12"){
			processData += parseFloat(ques_process.process[i].total)/5;
		}

		if(processID=="5" || processID=="6" || processID=="13")
			processData += (ques_process.process[i].total)/ques_process.process[i].headings.length;


		processData +='</span></p></div><div class="col-md-3 col-sm-3 col-xs-12 text-right>">\
		<div class="pull-right"><a class="read_heading" rel='+ques_process.process[i].id+' data-toggle="modal" data-target="#popup-quesHeading">Edit</a> | <a class="delete_heading" rel='+ques_process.process[i].id+'>Delete</a>\
		</div></div></div><div id='+ques_process.process[i].id+' class="panel-collapse collapse" style="height: 0px;"><div class="panel-body">';




		if(!(processID=="5" || processID=="6" || processID=="13")){

			
			for(var j=0; j<ques_process.process[i].headings.length;j++) {

				var heading = ques_process.process[i].headings[j];
					var ques_heading = heading.sub_heading;	
					if(ques_process.sub_heading == undefined) {
						var ques_heading = "";
					} else {
						var ques_heading = ques_process.sub_heading;
					}
					
				processData += '<h2>'+ques_heading+'</h2>';

				processData += getQuestions(heading);
				//console.log(heading)
			}
		}
		else{
			
			processData += '<select id="selProcess" class="form-control" onchange="setHeadingID(this,'+ques_process.process[i].id+')">';
			processData += '<option value="">Select '+ques_process.process[i].type_name+'</option>';

			for(var j=0; j<ques_process.process[i].headings.length;j++) {
				
				var heading = ques_process.process[i].headings[j];
				processData += "<option value='"+heading.sub_heading_id+"'>"+heading.sub_heading_name+"</option>";

			}
			processData += '</select><div class="mainData"></div>';
		}

		processData += '</tbody></table></div></div></div>';

	};

	processData += '</div></div>';

	processData += "<div class='pull-right'><h4 style='color:#aaa'>Total Weightage: <span class='weightageTotal'></span></h4>"

	$("#admin-questionnaire-area").append(processData);
	setTotalScore();
}

function setHeadingID(Obj,processID){

//debugger;
//alert($(Obj).val())

	$("#"+processID+" .panel-body .mainData").html("")

	jQuery.each(jsonObj.process , function(i, val) {

	//Match the Process ID with the Selected Dropdown Value
	if(val.id==processID){
		$(val.headings).each(function(){
			//debugger;
			if($(this)[0].sub_heading_id == $(Obj).val()){
				processData = getQuestions($(this)[0],$(Obj).closest(".panel").find(".panel-heading"));

			}

		});
  	}

  	$("#"+processID+" .panel-body .mainData").html("").append(processData)




});

}

function getQuestions(heading,accordionObj){
	processData = "";
	processData += '<table class="admin-quesTable table table-bordered"><thead><tr><th style="width:5%;display:none">S.N</th><th style="width:75%;">Question</th><th style="width:10%;">Marks</th><th style="width:10%;">Edit</th></tr></thead><tbody>';

	total = 0;
	if(heading.questions) {
		for(var k=0; k<heading.questions.length; k++) {
		marks = heading.questions[k].marks;
		total += parseFloat(marks);
		processData += '<tr><td style="display:none">'+heading.questions[k].question_id+'</td><td class="question-row">'+heading.questions[k].question+'</td><td class="marks-row">'+marks+'</td><td><a class="read_question" rel='+heading.questions[k].question_id+' data-toggle="modal" data-target="#popup-questions">Edit</a> | <a class="delete_question" rel='+heading.questions[k].question_id+'>Delete</a></td></tr>';
		}
	}

	if(accordionObj!=undefined)
		$(accordionObj).find(".adminQues_totalScore .bold").text(total);


	return processData;

}

function setTotalScore(){
	scoreCount = $(".adminQues_totalScore .bold");
	// debugger
	scoreTotal = 0;
	for(i=0; i<scoreCount.length; i++){
		console.log(scoreTotal)
		x = $(scoreCount[i]).text();
		if(x=="")
			x=0;

		scoreTotal += parseFloat(x);
	}
	$(".weightageTotal").html(scoreTotal);
}


function updateHeading(formObj){
    var new_heading = $("#"+formObj).find("#txtHeading").val();
    $(activeObj).closest(".panel-heading").find(".panel-title a").html(new_heading);
    jsonObjHeading.type_name = new_heading;

    
   
}

function updateQuestion(formObj) {
    var new_question = $("#"+formObj).find("#txtQuestionName").val();
    var new_marks = $("#"+formObj).find("#txtedit_marks").val();

    $(questionObj).closest('tr').find('td:nth-child(2)').html(new_question);
    $(questionObj).closest('tr').find('td:first-child + td + td').html(new_marks);

    jsonObjQuestion.question = new_question;
    jsonObjQuestion.marks = new_marks;

     var marks_row = $(questionObj).closest('table').find('.marks-row');
     var accordionID = $(questionObj).closest('table').closest('.panel-collapse').attr("id");

     if(accordionID=="2"){
	    total = 0;
	    $(marks_row).each(function( index ) {
			if($(this).text() != "" && $(this).prev().text().indexOf("Customer 2: ") != "" ) {
				total += parseInt($(this).text())
			}
		});
     }else{
     	total = 0;
	    $(marks_row).each(function( index ) {
			if($(this).text() != "") {
				total += parseInt($(this).text())
			}

		});
     }
    console.log(total);
    $(questionObj).closest(".panel-default").find(".adminQues_totalScore span").text(total);
    	setTotalScore();
    // $(".adminQues_totalScore").text(total);

}

function deleteRecord(formObj){
	$(deleteObj).closest(".panel-default").slideUp(500,function(){$(this).remove();})
}

function deleteQuestion(formObj) {
	$(delQuesObj).closest("tr").css("background", "#FF9900").hide(1000,function(){$(this).remove();})
}



