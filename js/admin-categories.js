if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}

$(document).ready(function(){

    var breadcrumb = '<ul class="crumbs">\
                        <li class="first"><a href="dss.html" style="z-index:9;"><span></span>Dealership Service Standards</a></li>\
                        <li><a href="#" style="z-index:8;">Audit Report</a></li>\
                    </ul>';
    $("#breadcrumb").append(breadcrumb);

    var page_url = window.location.href;
    getParameterByName(page_url);
    prodId = getParameterByName('audit_id');

    var file_name = "edit_audits"+prodId+ ".json";
    var path = "js/api/dss/moreinfo_audits/"+file_name;

    // alert(path)
    // var path = "index.php?";
    load_table(path);
});


function load_table(path) {
	$.ajax({ 
	        type: 'GET', 
            url : admin_host+ 'index.php?action=fetchAuditDataPage',
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

function create_table_audits(dealerAuditDashboard) {

    //alert(dealerAuditDashboard)

    var dash = dealerAuditDashboard.details;

    var dealerAuditDashboard_color = [{"color" : "#2980B9"},{"color" : "#E74C3C"},{"color" : "#8E44AD"},{"color" : "#16A085"}];
    console.log(dash[0].type_id)
    for (var p=0;p<dash.length;p++) {
       
        var dealer_audit_dashboard = '<div class="col-sm-3"><div class="circle-tile"><a href="#"><div class="circle-tile-heading" style="z-index:1000;background: '+dealerAuditDashboard_color[p].color+' "><i class="fa '+dash[p].icon_name+' fa-fw fa-3x"></i></div></a><div class="circle-tile-content" style="position: relative;height:180px;background: '+dealerAuditDashboard_color[p].color+' "><div class="circle-tile-description text-faded"><h4>'+dash[p].type_name+'</h4><div style="height:50px;">Weightage: '+dash[p].weightage+'</div></div><div class="circle-tile-number text-faded dealerAuditDashboard">';    
        dealer_audit_dashboard += '</div><a href="#" onclick="setDSSID('+dash[p].type_id+')" class="circle-tile-footer" style="position:absolute;bottom:0;width:100%;">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div></div>';

        $("#dealer_audit_dashboard").append(dealer_audit_dashboard);

    }

    var dealer_audit_total;

    $("#dealer_name").html("<strong>Dealer Name: </strong>"+  dealerAuditDashboard.dealer_name)

    str = "<p>Dealer Code : "+dealerAuditDashboard.dealer_code+"</p><p>Date : "+dealerAuditDashboard.audit_date+"</p>";
    str1 = "<p>Adherence : "+dealerAuditDashboard.adherence+"</p><p>Max Score : "+dealerAuditDashboard.max_score+"</p><p>Dealer Score : "+dealerAuditDashboard.dealer_score+"</p>";


    localStorage['auditID'] = dealerAuditDashboard.audit_id;


    $("#dealer_col1").html(str);
    $("#dealer_col2").html(str1);


}

function setDSSID(x){
    localStorage['type_id'] = x;
    if(x!=2) {
        location.href="admin-questionnaire.html?typeID="+x;    
    } else {
        alert("Manpower can not be edited");
    }
    
    // location.href = "admin-questionnaire.html";
    
}