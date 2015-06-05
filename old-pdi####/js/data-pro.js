$(document).ready(function(){     
        load_table();
});
// var customurl='https://gladminds.co/aftersell/api/cts/';
var customurl='inc/';

function load_table() {
    
    $.ajax({ 
            type: 'GET', 
            url:customurl+'data-in.php', 
            data: { get_param: 'value' }, 
            dataType: 'json',
            success: function (c_data, status) {
                        closedTable(c_data); 
                    
                },
            error: function(e){
                console.log(e);
            }
        });
}
function closedTable(c_data) {
   var dashboard_area = '<table id="openIND-table" class="table table-bordered table-hover table-green dataTable" aria-describedby="openIND-table_info"><thead><tr role="row"><th>Transporter Id<th>Indent No.</th><th>DO No.</th><th>LR No.</th><th>Vehicle No.</th><th>Container No</th><th>Seal No.</th><th>Transaction Id</th></tr></thead></table>';
    
    $("#openIND-table_wrapper").append(dashboard_area);
    for (var x=0;x<c_data.length;x++) {

        var ind_no = c_data[x].indent_no;
        var v_no = c_data[x].vehicle_no;
        var l_no = c_data[x].lr_no;
        var container_no = c_data[x].container_no;
        var seal_no = c_data[x].seal_no;
        var transporter_id = c_data[x].transporter_id;
        var transaction_id = c_data[x].transaction_id;
        var do_no='';
        var recent_data = '<tbody><tr><td>'+transporter_id+'</td><td class="ind" id='+ind_no+'>'+ind_no+'</td><td>'+do_no+'</td><td>'+l_no+'</td><td>'+v_no+'</td><td>'+container_no+'</td><td>'+seal_no+'</td><td>'+transaction_id+'</td></tr></tbody>';
        $("#openIND-table").append(recent_data);       
    }
        

    $('#openIND-table').dataTable({
        "iDisplayLength":5
    });
    $(".ind").click(function(){        
        $("#popup").slideDown();
        var id=$(this).attr('id');
        $.ajax({ 
            type: 'POST', 
            url:customurl+'inddisplay.php', 
            data:  {id:id }, 
            dataType: 'json',
            success: function (ind_data, status) {
                        create_table_ind(ind_data); 
                    
                },
            error: function(e){
                console.log(e);
            }
        });
        // alert(id);
    });
}
function create_table_ind(ind_data) {
    var dashboard_area='',recent_data='';
    dashboard_area = '<table id="openData-table" class="table table-bordered table-green dataTable" aria-describedby="openData-table_info"><thead><tr role="row"><th>Indent No.</th><th>LR No.</th><th>Vehicle No.</th><th>Container No.</th><th>Seal No.</th><th>Action</th></tr></thead></table>';
    // class="table table-bordered table-hover table-green dataTable" aria-describedby="openIND-table_info"
    $("#openData").html("").append(dashboard_area);
    for (var x=0;x<ind_data.length;x++) {

        var ind_no = ind_data[x].indent_no;
        var v_no = ind_data[x].vehicle_no;
        var l_no = ind_data[x].lr_no;
        var container_no = ind_data[x].container_no;
        var seal_no = ind_data[x].seal_no;
        // alert(seal_no);
        var cid=ind_no+x+'-c';
        var sid=ind_no+x+'-s';
        var sbid='sb-'+ind_no+x;
        var lid=ind_no+x+'-l';
        var recent_data = '<tr><td>'+ind_no+'</td><td id='+lid+'>'+l_no+'</td><td>'+v_no+'</td><td><input size=15 maxlength=15  type=text id='+cid+' value='+container_no+'></td><td><input size=20 maxlength=20  type=text id='+sid+' value='+seal_no+'></td><td><button id='+sbid+' class=ind-edit>Submit</button></td></tr>';
        $("#openData-table").append(recent_data);
        
    }
    $("#popup #openData-table tr td .ind-edit").css({"background": "#fff","border":"1px solid #fff","box-shadow":"none","color":"#000","font-weight":"normal"}); 
    $("#popup #openData-table tr td input").keypress(function (e) {
        var bid=$(this).attr('id');
        var x='sb-'+bid.substr(0,bid.length-2);
        $('#'+x).text("Submit").css({"background": "#fff","border":"1px solid #fff","box-shadow":"none","color":"#000","font-weight":"normal"}); 
    
        var v=$(this).val();
        // checkData();
        if (v!=" " && (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which < 65 || e.which > 90) && (e.which < 97 || e.which > 122))) {
            //display error message
            $(this).focus();
            return false           
        }
        
    });
    // $("#popup #openData-table tr td input").blur(function (e) {
    //     var bid=$(this).attr('id');
    //     var v=$(this).val();
    //     // checkData();
    //     if (v!=" " && (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which < 65 || e.which > 90) && (e.which < 97 || e.which > 122))) {
    //         //display error message
    //         $(this).focus();
    //         return false           
    //     }
        
    // });

    $(".ind-edit").click(function(){   
        var id=$(this).attr('id');
        var x=id.substr(3,id.length);
        var lr=x+'-l';
        var c_id=x+'-c';
        var s_id=x+'-s';
        var lr_val=$("#"+lr).text();
        var c_val=$("#"+c_id).val();
        var s_val=$("#"+s_id).val();

        $.ajax({ 
            type: 'POST', 
            url:customurl+'insertind.php', 
            data: {id:lr_val,c_val:c_val,s_val:s_val}, 
            dataType: 'json',
            success: function (edit_data, status) {                    
                },
            error: function(e){
                console.log(e);
                $('#'+id).text("Success").css({"background": "none","border":"none","box-shadow":"none","color":"#fff","font-weight":"bold"}); 
            }
        });
    });
  
}