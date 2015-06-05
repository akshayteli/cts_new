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

$(document).ready(function(){
	var page_url = window.location.href;
    getParameterByName(page_url);
    prodId = getParameterByName('subCatId');

    subcategory = [{"title" : "Workshop"},{"title" : "PDI"}];

    var breadcrumb = '<ul class="crumbs">\
                        <li class="first"><a href="dss.html" style="z-index:9;"><span></span>Dealership Service Standards</a></li>\
                        <li><a href="admin-categories.html" style="z-index:8;">Audit Report</a></li>\
                        <li><a href="admin-questionnaire.html?typeID=3" style="z-index:7;">Tools and Equipment</a></li>\
                        <li><a href="#" style="z-index:6;">'+subcategory[prodId-1].title+'</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrumb);

    $.ajax({
    	type : 'GET',
    	url : admin_host+ 'index.php?action=getsubcategorydetails&id='+prodId+'&auditID='+localStorage.getItem("auditID"),
    	dataType : 'json',
    	success : function(subCat, status){
            jsonObj = subCat;
    		create_subcategories(subCat);
    	},
    	error : function(e) {
    		console.log(e)
    	}
    })

});


var create_subcategories = function(subCat) {
	var tools = subCat.details;

	var processData = '<div class="portlet-body"><div class="panel-group" id="accordion">';

	for (var i = 0; i < tools.length; i++) {

		processID = tools[i].id;

		processData += '<div class="panel panel-default"><div class="panel-heading clearfix question_accord_block"><div class="col-md-9 col-sm-9 col-xs-12"><h4 class="panel-title audit-accordian adminQues_heading">\
		<a class="acc-heading" data-toggle="collapse" data-parent="#accordion" href="#'+tools[i].id+'" class="collapsed adminQues_heading">'+tools[i].accordion_name+'</a>\
		</h4><p class="adminQues_totalScore">Total Score : <span class="bold">'+tools[i].total_score+'</span></p></div><div class="col-md-3 col-sm-3 col-xs-12 text-right>">\
		<div class="pull-right"><a class="read_heading" rel='+tools[i].id+' data-toggle="modal" data-target="#popup-quesHeading">Edit</a> | <a class="delete_heading" rel='+tools[i].id+'>Delete</a>\
		</div></div></div><div id='+tools[i].id+' class="panel-collapse collapse" style="height: 0px;"><div class="panel-body"><table class="admin-quesTable table table-bordered"><thead><tr><th style="width:5%;display:none">S.N</th><th style="width:75%;">Question</th><th style="width:10%;">Marks</th><th style="width:10%;">Edit</th></tr></thead><tbody>';

		for(j=0;j<tools[i].questions.length;j++) {
			processData += '<tr><td style="display:none">'+tools[i].questions[j].question_id+'</td><td class="question-row">'+tools[i].questions[j].question+'</td><td class="marks-row">'+tools[i].questions[j].marks+'</td><td><a class="read_question" rel='+tools[i].questions[j].question_id+' data-toggle="modal" data-target="#popup-questions">Edit</a> | <a class="delete_question" rel='+tools[i].questions[j].question_id+'>Delete</a></td></tr>';
		}

		processData += '</tbody></table></div></div></div>';

	};

	processData += '</div></div>';

    processData += "<div class='pull-right'><h4 style='color:#aaa'>Total Weightage: <span class='weightageTotal'></span></h4>"

	$("#admin-subcategory-area").append(processData);
    setTotalScore();
}


    $(document).on('click', '.read_heading', function(){
        activeObj = $(this);

        var rel = $(this).attr('rel');

        $.each(jsonObj.details, function(i, v) {
            if (v.id == rel) {
                jsonObjHeading = v;
                var txtHeading = jsonObjHeading.accordion_name;
                $("#txtHeading").val(txtHeading);

                $("#txtHeadingID").val(rel);
                return;
            }
        });
    });


    $(document).on('click', '.read_question', function(){

        questionObj = $(this);
        var rel = $(this).attr('rel');

        for(var p=0;p<jsonObj.details.length;p++) {
            for(var q=0; q<jsonObj.details[p].questions.length;q++) {
                var quesObj = jsonObj.details[p].questions[q];
                if(quesObj.question_id == rel) {
                    jsonObjQuestion = quesObj
                    $("#txtQuestionName").val(quesObj.question);
                    $("#txtedit_marks").val(quesObj.marks);
                    $("#txtQuestionID").val(rel);
                    return;
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

                $("#deleteRec #action").val("deleteHeading");
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

                $("#deleteQues #action").val("deleteQuestion");
                $("#deleteQues #txtQuestionID").val(recID);
            
                $("#deleteQues").submit();
                
            } 
        }); 
    })

    $(document).on('click', '#editHeading', function(){
        $("#editHeadingForm").submit();
    });

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

    function updateHeading(formObj){
    var new_heading = $("#"+formObj).find("#txtHeading").val();
    $(activeObj).closest(".panel-heading").find(".panel-title a").html(new_heading);
    jsonObjHeading.type_name = new_heading;

    
   
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
    } else {
        total = 0;
        $(marks_row).each(function( index ) {
            if($(this).text() != "") {
                total += parseInt($(this).text())
            }

        });
     }

           $(questionObj).closest(".panel-default").find(".adminQues_totalScore span").text(total);
           setTotalScore();
}

function deleteRecord(formObj){
    $(deleteObj).closest(".panel-default").slideUp(500,function(){$(this).remove();})
}

function deleteQuestion(formObj) {
    $(delQuesObj).closest("tr").css("background", "#FF9900").hide(1000,function(){$(this).remove();})
}


