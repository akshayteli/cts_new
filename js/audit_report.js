if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}

$(document).ready(function(){

	var months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    today = new Date();
    var dd = today.getDate();

    var previous_date = dd-1;

    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }  

    var current_month = months[mm];

    var previous_date = dd-1;

    today = current_month+' '+dd+', '+yyyy;
    $("#bajaj-todays-date").text(today);

    var page_url = window.location.href;
    getParameterByName(page_url);
    prodId = getParameterByName('audit_id');

    var file_name = "edit_audits"+prodId+ ".json";
    var path = "index.php?";

    document.getElementById("txtAuditDate").value = (dd+ "-" +(mm+1)+ "-" +yyyy) 
    $("#txtAuditDateDisp").text(today);

});

function load_table(path) {
	$.ajax({ 
	        type: 'GET', 
	        url: path, 
	        data: { get_param: 'value' }, 
	        dataType: 'json',
	        success: function (dealerAuditDashboard, status) {

	        			//console.log(dealerAuditDashboard);
	        			create_table_audits(dealerAuditDashboard); 
	        		
	            },
	        error: function(e){
	            console.log(e);
	        }
	    });
}

var boxCount;

var canSubmit = new Array();

function create_table_audits(dealerAuditDashboard) {

    //alert(dealerAuditDashboard)

    var dash = dealerAuditDashboard.details;

    boxCount = dash.length;

    var dealerAuditDashboard_color = [{"color" : "#2980B9"},{"color" : "#E74C3C"},{"color" : "#8E44AD"},{"color" : "#16A085"}];


    for (var p=0;p<dash.length;p++) {

        if(dash[p].submitted_status == 1) {
            disabled = "disabled"
        } else {
            disabled = "";
        }

        var dealer_audit_dashboard = '<div class="col-sm-3"><div class="circle-tile"><a href="#"><div class="circle-tile-heading" style="background: '+dealerAuditDashboard_color[p].color+' "><i class="fa '+dash[p].icon_name+' fa-fw fa-3x"></i></div></a><div onclick="setDSSID('+dash[p].type_id+')" class="circle-tile-content" style="cursor:pointer;background: '+dealerAuditDashboard_color[p].color+' "><div class="circle-tile-description text-faded"><h4>'+dash[p].type_name+'</h4></div><div class="circle-tile-number text-faded dealerAuditDashboard">';

            for(var q=0;q<dash[p].legends.length;q++) {

                if((dash[p].legends[q].score == "") || (dash[p].legends[q].score == 0)){
                    dash[p].legends[q].score = "-";
                }

                dealer_audit_dashboard +='<p>'+dash[p].legends[q].type+' : <span class="txt'+q+'">'+dash[p].legends[q].score+'</span></p>';
            }

            //$(".dealerAuditDashboard p:nth-child(2)")[0]

            canSubmit.push(dash[p].canSubmit);

            dealer_audit_dashboard += '</div><a href="#" onclick="setDSSID('+dash[p].type_id+')" class="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div>';

            if(dealerAuditDashboard.editable=="1"){
                dealer_audit_dashboard += '<button id="'+dash[p].type_id+'" type="button" '+disabled+' class="circle-tile-footer footer-submit-btn" onclick="submitQuestionnaire('+dash[p].type_id+',this,'+dash[p].canSubmit+')">Submit</button>';
            }

            dealer_audit_dashboard += '</div>';

        $("#dealer_audit_dashboard").append(dealer_audit_dashboard);

        var user_type = localStorage.getItem('user_type');
        if(user_type == 1) {
            $(".circle-tile-footer").remove();

        }
        
     
    }

        if(dealerAuditDashboard.editable=="1"){
            str = '<div class="row"><div style="text-align:center;" class="col-md-12 col-xs-12"><button style="float:none;" onclick="VerifyForms(0,this)" class="submitForm btn btn-primary col-md-6 col-xs-12" type="button">Submit All Forms</button></div></div>'
            if(user_type != 1) {
                $("#dealer_audit_dashboard").append(str);
            }
        }
        //submitQuestionnaire(0,this)
    
        var dealer_audit_total; 
        localStorage.setItem("txtDealerName",dealerAuditDashboard.dealer_name)
        localStorage.setItem("txtAuditID",dealerAuditDashboard.audit_id)
        localStorage.setItem("txtDealerCode",dealerAuditDashboard.dealer_code)
        localStorage.setItem("txtAuditDate",dealerAuditDashboard.audit_date)
        

        $("#dealer_name").html("<strong>Dealer Name: </strong>"+  dealerAuditDashboard.dealer_name)

        var audit_date = moment(dealerAuditDashboard.audit_date).format('LL');

        str = "<p><span class='blueFont'>Dealer Code</span>: "+dealerAuditDashboard.dealer_code+"</p><p><span class='blueFont'>Date</span>: "+audit_date+"</p>";

        if((dealerAuditDashboard.dealer_score == 0) || (dealerAuditDashboard.dealer_score == "")) {
            dealerAuditDashboard.dealer_score = "-"
        }

        if((dealerAuditDashboard.adherence == 0) || (dealerAuditDashboard.adherence == "")) {
            dealerAuditDashboard.adherence = "-"
        }


        str1 = "<p><span class='blueFont'>Weightage</span>: "+dealerAuditDashboard.max_score+"</p><p><span class='blueFont'>Total Score</span>: "+dealerAuditDashboard.dealer_score+"</p><p><span class='blueFont'>Adherence</span>: "+dealerAuditDashboard.adherence+"</p>";


        localStorage['auditID'] = dealerAuditDashboard.audit_id;


        $("#dealer_col1").html(str);
        $("#dealer_col2").html(str1);


}

function VerifyForms(qID,obj) {
    var xhtmlTree = $("#dealer_audit_dashboard").find(".txt1");

    // if((xhtmlTree[0].innerHTML != "-") && (xhtmlTree[1].innerHTML != "-") && (xhtmlTree[2].innerHTML != "-") && (xhtmlTree[3].innerHTML != "-")) {
    
    if(canSubmit.indexOf("0")!=-1) {

        bootbox.alert("Please fill All the Forms before submitting");
        return;

    }
    else {
        submitQuestionnaire(qID,obj,1)
    }

}

function submitQuestionnaire(qID,obj,blockSubmit){

    // var xhtml = $(obj).parent().find(".txt1").html();

    if(!blockSubmit) {
        bootbox.alert("Please fill the form before submitting")
        return;
    }

    bootbox.confirm("Once Submitted the data cannot be edited.<br/>Are you sure you want to submit the Quessionnaire?",function(result){
        if(result){
            showLoading();
            $.getJSON( host+"index.php?action=submitQuestionnaire&auditID="+localStorage['auditID']+"&qID="+qID, function( data ) {
                    hideLoading();
                    if(data.status == 1) {
                        $("#"+qID).prop("disabled",true);
                        $("#"+qID).css("background", "#ccc")
                    }
                    
                    if(qID=="0") {
                        for(var id=0;id<=boxCount;id++) {
                            $("#"+id).prop("disabled",true);
                        }
                        location.href="dss.html";
                    }
            });
        }
    });
}

function go_dss() {
    window.location.href = "dss.html"
}

function setDSSID(x){
    localStorage['type_id'] = x;
    location.href="audit-questionnaire.html";    
}