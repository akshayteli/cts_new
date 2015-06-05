var prodID;

if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}

$(document).ready(function(){
    showLoading();
    showDealerInfo();


    $(document).on("keydown", ".auditRemarks",function(){
        $(getParentQuestion($(this))).removeClass("redFont")
    })

	var page_url = window.location.href;
	prodID = getUrlParameter('subcategoryid');

    var auditCategoreis = [{"category":"Workshop"},{"category":"PDI"}]

    var breadcrumb = '<ul class="crumbs">\
                        <li class="first"><a href="dss.html" style="z-index:9;"><span></span>Dealership Service Standards</a></li>\
                        <li><a href="audit-report_new.html" style="z-index:8;">Audit Report</a></li>\
                        <li><a href="audit-questionnaire.html" style="z-index:7;">Tools and Equipment</a></li>\
                        <li><a href="#" style="z-index:6;">'+auditCategoreis[prodID-1].category+'</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrumb);

	$.ajax({ 
        type: 'GET', 
        url: host+ 'index.php?action=getsubcategorydetails&id='+prodID+'&auditID='+localStorage.getItem("auditID"), 
        dataType: 'json',
        success: function (subcategory_data, status) {

            // if(localStorage.getItem("subStatus")!=1 || localStorage.getItem("subStatus")==undefined ){
            if(subcategory_data.editable=="1"){ 
        			create_process_ques_edit(subcategory_data)
                    hideLoading();

                    $("#accordion").on('shown.bs.collapse', function(){
                        $(this).find(".acc-heading.accordion-active").focus();
                    });
                    

            }
            else{
                    create_process_ques(subcategory_data)
                    hideLoading();

                    $("#accordion").on('shown.bs.collapse', function(){
                        $(this).find(".acc-heading.accordion-active").focus();
                    });
            }
				        		
            },
        error: function(e){
            hideLoading();
            console.log(e);
        }
    });
})

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}


function create_process_ques(ques_process) {

    var subhead = ques_process.details;
    if(prodID == 1) {
        var heading = 'For Workshop'
    } else {
        var heading = 'For PDI'
    }

    var data = '<div class="row"><div class="portlet"><div class="col-lg-12"><div class="portlet-heading"><div class="portlet-title"><h4>'+heading+'</h4></div><div class="clearfix"></div></div><div class="portlet-body"><div class="panel-group" id="accordion">';

       for (var i=0; i<subhead.length;i++) {    

        if ((subhead[i].total_score == "") || (subhead[i].total_score == 0)) {
            subhead[i].total_score = "-";
        }    

            data += '<div class="panel panel-default"><div class="panel-heading"><div class="col-md-12 clearfix portlet-title padding-zero"><div class="col-md-6 col-sm-6 col-xs-12 padding-zero"><a class="audit-accordian" data-toggle="collapse" data-parent="#accordion" href="#'+subhead[i].id+'"><h4 class="acc-heading" tabindex="1">'+subhead[i].accordion_name+'</h4></a></div><div class="col-md-6 col-sm-6 col-xs-12 process-ques-head-totals padding-zero text-right"><label>Weightage : <span class="span_weightage">'+subhead[i].weightage+'</span></label><br><label>Total Score: <span class="span_total">'+subhead[i].total_score+'</span></label><br><label>Adherence : <span class="span_adh">'+subhead[i].adherence+'</span></label></div></div><div class="clearfix"></div></div><div id='+subhead[i].id+' class="panel-collapse collapse" style="height: 0px;"><div class="panel-body">';

            for(var j=0; j<subhead[i].questions.length;j++) {

                 yes = "";
                    no = "";

                if(subhead[i].questions[j].dealer_score == "") {
                    yes = "yes";
                    no = "no";
                    var ans = "No Score";
                    var bg_ans = "dark-gray";

                } else if(subhead[i].questions[j].dealer_score > 0) {
                    yes = "yes active";
                    no = "no";
                    var ans = "YES";
                    var bg_ans = "green";
                } else {
                    yes = "yes";
                    no = "no active";
                    var ans = "No";
                    var bg_ans = "red";
                }




                data += '<div class="panel-heading"><input type="hidden" name="questionID[]" value="'+subhead[i].questions[j].question_id+'"><input type="hidden" name="dealerScore[]" value="'+subhead[i].questions[j].answer+'" class="dealerscore"><p class="panel-title">'+(j+1)+". "+subhead[i].questions[j].question+'<span class="label ans_label"></span></p><blockquote class="saveBtn-wrapper"><div class="btn-group" data-toggle="buttons"><span class="label ans_label '+bg_ans+' ">'+ans+'</span></div><p></p><p><label class="edit-labels">Max. Score : </label><span class="">'+subhead[i].questions[j].marks+'</span></p><p><label class="edit-labels">Dealer Score: </label><span class="changable-val dealerscore'+j+'">'+subhead[i].questions[j].dealer_score+'</span></p><p><label class="edit-labels-textarea">Remarks :</label><p>'+subhead[i].questions[j].remarks+'</p></p></blockquote></div>';
            }
            
            data += '</div></div></div>';
        }
                                        
        data += '</div></div></div></div></div>';

        $("#audit-subcategory-area").append(data);

        if(ques_process.editable=="1"){
            str = '<div class="row"><div class="col-md-12 col-xs-12" style="text-align:center;"><button type="button" class="btn btn-primary submit-btn-edit col-md-6 col-xs-12" onclick="saveAllForms()">Save All Forms</button></div></div>'
            $("#audit-subcategory-area").append(str);
        }

        $('#accordion').on('shown.bs.collapse', function () {
            console.log($(".accordion-active").parent())
            $(".accordion-active").parents().focus();
        })
}

function create_process_ques_edit(ques_process) {
	var subhead = ques_process.details;
	if(prodID == 1) {
		var heading = 'For Workshop'
	} else {
		var heading = 'For PDI'
	}

	var data = '<div class="row"><div class="portlet"><div class="col-lg-12"><div class="portlet-heading"><div class="portlet-title"><h4>'+heading+'</h4></div><div class="clearfix"></div></div><div class="portlet-body"><div class="panel-group" id="accordion">';

       for (var i=0; i<subhead.length;i++) {    

        if ((subhead[i].total_score == "") || (subhead[i].total_score == 0)) {
            subhead[i].total_score = "-";
        }    

        	data += '<div class="panel panel-default"><div class="panel-heading"><div class="col-md-12 clearfix portlet-title padding-zero"><div class="col-md-6 col-sm-6 col-xs-12 padding-zero"><a class="audit-accordian" data-toggle="collapse" data-parent="#accordion" href="#'+subhead[i].id+'"><h4 class="acc-heading" tabindex="1">'+subhead[i].accordion_name+'</h4></a></div><div class="col-md-6 col-sm-6 col-xs-12 process-ques-head-totals padding-zero text-right"><label>Weightage : <span class="span_weightage">'+subhead[i].weightage+'</span></label><br><label>Total Score: <span class="span_total">'+subhead[i].total_score+'</span></label><br><label>Adherence : <span class="span_adh">'+subhead[i].adherence+'</span></label></div></div><div class="clearfix"></div></div><div id='+subhead[i].id+' class="panel-collapse collapse" style="height: 0px;"><form class="clearfix frmQuestions" name="frm_'+i+'" id="frm_'+i+'" onsubmit="return submitQuestionForm(this.id)" method="post"><div class="panel-body">\
                <input type="hidden" name="action" value="answersList_subHeaders">\
                <input type="hidden" name="dssID" value="'+localStorage.getItem("type_id")+'">\
                <input type="hidden" name="processID" value="'+subhead[i].id+'">\
                <input type="hidden" name="auditID" value="'+localStorage.getItem("auditID")+'">';

            for(var j=0; j<subhead[i].questions.length;j++) {

                 yes = "";
                    no = "";

                if(subhead[i].questions[j].dealer_score == "") {
                    yes = "yes";
                    no = "no";
                } else if(subhead[i].questions[j].dealer_score > 0) {
                    yes = "yes active";
                    no = "no"
                } else {
                    yes = "yes";
                    no = "no active"
                }

            	data += '<div class="panel-heading"><input type="hidden" name="questionID[]" value="'+subhead[i].questions[j].question_id+'"><input type="hidden" name="dealerScore[]" value="'+subhead[i].questions[j].dealer_score+'" class="dealerscore"><p class="panel-title" tabindex="1">'+(j+1)+'. '+subhead[i].questions[j].question+'<span class="label ans_label"></span></p><blockquote class="saveBtn-wrapper"><div class="btn-group" data-toggle="buttons"><label class="saveBtn btn btn-ques-radio '+yes+' "><input class="ques-radioBtns" '+yes+' type="radio" id="sal" value="'+subhead[i].questions[j].marks+'" name="1">YES</label><label class="saveBtn btn btn-ques-radio  bttn '+no+' "><input class="ques-radioBtns" '+no+' type="radio" id="sal1" value="0" name="1">NO</label><label class="saveBtn btn btn-ques-reset resetbttn"><input class="ques-radioBtns" type="radio" id="" value="reset" name="1">RESET </label></div><p></p><p><label class="edit-labels">Max. Score : </label><span class="">'+subhead[i].questions[j].marks+'</span></p><p><label class="edit-labels">Dealer Score: </label><span class="changable-val dealerscore'+j+'">'+subhead[i].questions[j].dealer_score+'</span></p><p><label class="edit-labels-textarea">Remarks :</label><textarea colspan="4" rowspan="2" name="auditRemarks[]" class="auditRemarks">'+subhead[i].questions[j].remarks+'</textarea></p></blockquote></div>';
            }
            
            data += '</div><button type="submit" class="btn btn-primary float-right">Save</button></form></div></div>';
        }
                                        
        data += '</div></div></div></div></div>';

        $("#audit-subcategory-area").append(data);
        if(localStorage.getItem("subStatus")!=1){
            str = '<div class="row"><div class="col-md-12 col-xs-12" style="text-align:center;"><button type="button" class="btn btn-primary submit-btn-edit col-md-6 col-xs-12" onclick="saveAllForms()">Save All Forms</button></div></div>'
            $("#audit-subcategory-area").append(str);
        }

        $('#accordion').on('shown.bs.collapse', function () {
            console.log($(".accordion-active").parent())
            $(".accordion-active").parents().focus();
        })

}

function changeColor(formObj){

    selObj = $("#"+formObj).closest(".panel-body").find("select");

    //debugger;

    if(selObj.length)
        selObj[0].options[selObj[0].options.selectedIndex].style.backgroundColor ="#efefef";

}


function getParentQuestion(obj){

    myObj = $(obj).closest(".panel-heading").find(".panel-title");

    $(myObj).addClass("redFont");
    // debugger
    return myObj;
}


function doValidate(objForm){

    var trueFlag = true;

    rFalse = false;
    // debugger;
    
    techYesOrNo = $("#"+objForm).find('[name="dealerScore[]"]');

    if(techYesOrNo.length)
      $.each(techYesOrNo, function(i,x){
        if($(this).val() == 'undefined' || $(this).val() == ''){
          trueFlag = false;
          if(!($("#"+objForm).parent().hasClass("in")))
            $("#"+objForm).parent().addClass("in");
          
          obj = this;

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


    techRemarks = $("#"+objForm).find('.no.active');

    if(techRemarks.length)
      $.each(techRemarks, function(i,x){
        txtArea = $(this).closest("blockquote").find("textarea");

        if($(txtArea).val().trim() == ""){
          trueFlag = false;
            obj = this;

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

    return trueFlag;
}


function submitQuestionForm(objForm,x){



    trueFlag = doValidate(objForm);
    if(trueFlag){
        ajaxifyAudit(objForm,changeColor,1);
    }

    return false;

}

// function saveAllForms(){
//     frms = $(".frmQuestions");
//     // total = frms.length;
//     console.log(frms)
//     $(frms).each(function(index) {
//         //showLoading();
//         if (index === total - 1){
//             submitQuestionForm(frms[index].id);
//         }
//         else{
//             submitQuestionForm(frms[index].id,1);
//         }
//     }); 
// }



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


function showDealerInfo() {

    var txtDealerName =  localStorage.getItem("txtDealerName")
    var txtAuditID = localStorage.getItem("txtAuditID")
    var txtDealerCode = localStorage.getItem("txtDealerCode")
    var txtAuditDate = localStorage.getItem("txtAuditDate")
    

    $("#dealer_name").html("<strong>Dealer Name: </strong>"+  txtDealerName)
    $(".dealerCode").html("<strong>Dealer Code: </strong>"+  txtDealerCode)

}

$(document).on("change", ".ques-radioBtns", function(){



        myObj = getParentQuestion($(this));
        $(myObj).removeClass("redFont");
        $(myObj).blur();


        var cur_value = $(this).val();
        //pid = $(this).closest(".saveBtn-wrapper").attr("id");

        thisVal = $(this).val();

        if(thisVal=="reset")
            thisVal = "";


        $(this).closest(".panel-heading").find(".changable-val").text(thisVal);
        $(this).closest(".panel-heading").find(".dealerscore").val(thisVal);

        var resPos = $(this).closest(".panel").find("#sal").val();

        var adh = 0;
        var total_score = $(this).parents(".panel").find(".span_weightage").text();


        myObj = $(this).closest(".panel-body").find(".changable-val");
        total = 0;

        $.each(myObj,function(){

            questionVal = $(this).text() ;

            if(questionVal==NaN || questionVal=="NaN" || questionVal == undefined || questionVal == ""  )
                questionVal = 0
            
                total += parseInt(questionVal);

        });

        var adherence = (total/total_score)*100

        
        $(this).parents(".panel").find(".span_total").text(total)
        $(this).parents(".panel").find(".span_adh").text(adherence.toFixed(2)+ "%")


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