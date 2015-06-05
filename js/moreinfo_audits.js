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
    prodId = getParameterByName('id');
    


    if(prodId=="1")
        $("#table-title-coupons").html("Submitted Dealer Audits")
    else if(prodId=="2")
        $("#table-title-coupons").html("Saved Dealer Audits")



    //var file_name = "audits"+prodId+ ".json";
    var file_name = host+"index.php?action=moreInfoAudits&statusID="+prodId;
    var path = file_name;
    showLoading();
    load_table(path);



});

function getParameterByName(url) {
    url = url.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + url + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function load_table(path) {
    showLoading();
    //alert(path)
	$.ajax({ 
	        type: 'GET', 
	        url: path, 
	        data: { get_param: 'value' }, 
	        dataType: 'json',
	        success: function (auditData, status) {
	        			create_table_audits(auditData); 
                        hideLoading();
	            },
	        error: function(e){
	            console.log(e);
                hideLoading();
	        }
	    });
}

function create_table_audits(auditData) {
	var headers = '<th style="text-align:center;">Dealer Code</th><th>Dealer Name</th><th style="text-align:center;">Auditer Name</th><th>Audit Start Date</th><th>Audit End Date</th><th style="text-align:center;">Total</th><th style="text-align:center;">Details</th>';

    $("#recentAudit-header").append(headers);

    var audit = auditData.details;
    
    for (var x=0;x<audit.length;x++) {
        
        var id = audit[x].dealer_id;
        var dealer_code = audit[x].dealer_code;
        var name = audit[x].dealer_name;
        // var date = moment(audit[x].audited_date).format('LL');
        var date = audit[x].audited_date;
        var edate = audit[x].audited_end_date;
        var score = audit[x].total_score;
        var auditID = audit[x].audit_id;
        var audited_by = audit[x].audited_by;

        //var url = "audit-report.html?audit_id="+auditID;
        prodId = getParameterByName('id');

        var recentAudit_tab_data = '<tr><td align="center"><strong>'+dealer_code+'</strong></td><td>'+name+'</td><td align="center">'+audited_by+'</td><td>'+date+'</td><td>'+edate+'</td><td align="center">'+score+'</td><td align="center"><strong><a href="#" onclick="openAuditReport('+auditID+')"">More Info</a></strong>';

        if(localStorage.getItem("user_type")=="2" && prodId=="2")
            recentAudit_tab_data +=' | <strong><a href="#" onclick="deleteAudit('+auditID+','+dealer_code+', this)" style="color:#ff0000;">Delete</a></strong>';

        recentAudit_tab_data +='</td></tr>';

        $("#bajaj-recentAudit-tbody").append(recentAudit_tab_data);
    }

        $('#bajaj-recentAudit-trails').dataTable();
        $("#recent_trails").css("display", "block");
}


function openAuditReport(auditID){
    localStorage.removeItem('auditID');

    localStorage['auditID'] = auditID;
    
    location.href = "audit-report_new.html"
}


function deleteAudit(auditID, dealer_code, ancObj){
    bootbox.confirm("Are you sure you want to delete Audit ID: '"+auditID+"' with Dealer Code '"+dealer_code+"'",function(result){

        if(result){
            path =  host+"index.php?action=deleteaudit&auditID="+auditID;

            $.ajax({ 
                type: 'GET', 
                url: path, 
                data: { get_param: 'value' }, 
                dataType: 'json',
                success: function (data, status) {
                            if(data.status==1){
                                $(ancObj).parents("tr").css("background","red").hide("slow");
                            }

                            hideLoading();
                    },
                error: function(e){
                    console.log(e);
                    hideLoading();
                }
            });
        }

    });
}