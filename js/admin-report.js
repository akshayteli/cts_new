
// Globals
var auditSections;
var auditData;
var regions;
var rsms;
var asms;
var dealers;


 $(document).ready(function(){
/* Export As CSV Start */

function exportTableToCSV($table, filename) {

        var $rows = $table.find('tr:has(td)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',

            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    }

    // This must be a hyperlink
    $(".export").on('click', function (event) {
        // CSV
        exportTableToCSV.apply(this, [$('#report-data>table'), 'export.csv']);

        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });

/* Export As CSV End */
        if(localStorage.getItem('user_type') == "3"){
            window.location = "dss.html"
        }

        var months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        var today = new Date();
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

        var yesterday = current_month+' '+previous_date+', '+yyyy;

        $("#bajaj-todays-date").text(today);
        // TODO -- Date format
        $("#fromDate,#toDate").datepicker({
            autoclose: true,
            // todayHighlight: true,
            format: "yyyy-mm-dd",
            viewMode: "months", 
            minViewMode: "months",
            endDate: '+0d',
        });
        
        // Date Change
        $("#fromDate").on('changeDate', function(){
            // set the "toDate" start to not be later than "fromDate" ends:
            $('#toDate').datepicker('setStartDate', new Date($(this).val()));
            
        });
        
        $("#toDate").on('changeDate', function(){
            // set the "fromDate" end to not be later than "toDate" starts:
            $('#fromDate').datepicker('setEndDate', new Date($(this).val()));
        
        }).change(function(){
            
            var date = new Date($(this).val());           
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            // alert($(this).val())
            if($(this).val()!="")
                $(this).val(lastDay.getFullYear()+'-'+get2D(lastDay.getMonth()+1)+'-'+get2D(lastDay.getDate()));

        });

        // Icon enabling
        $('.date-icon').click(function(){
            var targetFieldId = $(this).attr('rel');
            var targetField = $("#"+targetFieldId);
            targetField.datepicker('show');
        });


        // // Removing items based on roles
        // if(localStorage.getItem('user_type') == "1"){
        //     $(".regions").remove();
        // }
        // if (localStorage.getItem('user_type') == "2") {
        //     $(".regions").remove();
        //     $(".asms").remove();
        // };


        if(localStorage.getItem('user_type') == "5"){
            $(".regions").show();
            $(".asms").show();
        }
        if(localStorage.getItem('user_type') == "1"){
            $(".regions").remove();
            $(".asms").show();
        }
        if (localStorage.getItem('user_type') == "2") {
            $(".regions").remove();
            $(".asms").remove();
        };

        $(".dealers").show();

        // select 2 plug-in enabled
        $('select').select2(); // 

        load_sideMenus();

        /*other API calls*/
        showLoading();

        //Main Ajax
        if(localStorage.getItem('user_type') == "5"){
            // API
            // URL http://localhost/dss_new/apis/dss/index.php?action=getzones
            // LOCAL JSON: js/api/dss/getzones.json

            url = host+'index.php?action=getzones';

            $.ajax({
                type: 'GET',
                url: url,
                data: { get_param: 'value' }, 
                dataType: 'json',
                success: function(result){
                    // Assigning Values
                    regions = result.objects;
                    // if()
                    buildSelectField("regions","zone","First name");
                    refresh_report();

                    url = host+'index.php?action=getDealers';

                    $.ajax({
                        type: 'GET',
                        url: url,
                        data: { get_param: 'value' }, 
                        dataType: 'json',
                        success: function(result){

                            // Assigning Values
                            dealers = result.objects;
                            // Assigning Values
                            var selectField = $("#dealers").empty();
                            var t_arr = result.objects;
                            selectField.append("<option value=''>Select</option>");
                            $.each(t_arr, function(_in,_val){
                                //See if the Dealercode starts with 1
                                if(_val.dealer_code.indexOf('1') == 0)
                                selectField.append('<option value="'+_val.dealer_id+'">'+_val.dealer_code+' - '+_val['dealer_name']+'</option>');
                            });

                            selectField.select2();
                            refresh_report();
                            hideLoading();
                        }
                    });

                }
            });
        }else if(localStorage.getItem('user_type') == "1"){
            // API
            // URL http://localhost/dss_new/apis/dss/index.php?action=getAsms&area=chennai
            // LOCAL JSON: js/api/dss/getzones.json
            // TODO --

            url = host+'index.php?action=getAsms&zsm_id='+localStorage.getItem('rec_id');

            $.ajax({
                type: 'GET',
                url: url,
                data: { get_param: 'value' }, 
                dataType: 'json',
                success: function(result){
                    hideLoading();

                    asms = result.objects;
                    // Assigning Values
                    var selectField = $("#asms").empty();
                    var t_arr = result.objects;
                    selectField.append("<option value=''>Select</option>");
                    $.each(t_arr, function(_in,_val){
                        selectField.append('<option value="'+_val.id+'">'+_val.asm_id+' - '+_val['First name']+'</option>');
                    });

                    selectField.select2();
                    refresh_report();
                }
            });
        }else if(localStorage.user_type == "2"){
            // API
            // URL http://localhost/dss_new/apis/dss/index.php?action=getDealers&asmID=1193
            // LOCAL JSON: js/api/dss/getzones.json
            // TODO --
            url = host+'index.php?action=getDealers&asmID='+localStorage.getItem('rec_id');

            $.ajax({
                type: 'GET',
                url: url,
                data: { get_param: 'value' }, 
                dataType: 'json',
                success: function(result){
                    hideLoading();

                    // Assigning Values
                    dealers = result.objects;
                    // Assigning Values
                    var selectField = $("#dealers").empty();
                    var t_arr = result.objects;
                    selectField.append("<option value=''>Select</option>");
                    $.each(t_arr, function(_in,_val){
                        selectField.append('<option value="'+_val.dealer_id+'">'+_val.dealer_code+' - '+_val['dealer_name']+'</option>');
                    });

                    selectField.select2();
                    refresh_report();
                }
            });
        }
        

        // Onchange of Filters
        // regions
        $("#regions").change(function(){
            // API
            // URL http://localhost/dss_new/apis/dss/index.php?action=getAsms&area=chennai
            // LOCAL JSON: js/api/dss/getzones.json
            // TODO --
            showLoading();
            
            $("#asms").html('<option value="">Select</option>').select2();
            $("#dealers").html('<option value="">Select</option>').select2();
            $("#dealer-name").text('-');
            $("#city").text('-');
            
            url = host+'index.php?action=getAsms&zsm_id='+$(this).val();

            $.ajax({
                type: 'GET',
                url: url,
                data: { get_param: 'value' }, 
                dataType: 'json',
                success: function(result){
                    hideLoading();

                    asms = result.objects;
                    // Assigning Values
                    var selectField = $("#asms").empty();
                    var t_arr = result.objects;
                    selectField.append("<option value=''>Select</option>");
                    $.each(t_arr, function(_in,_val){
                        selectField.append('<option value="'+_val.id+'">'+_val.asm_id+' - '+_val['First name']+'</option>');
                    });

                    selectField.select2();
                }
            });
        })

        // ASMS
        $("#asms").change(function(){
            // API
            // URL http://localhost/dss_new/apis/dss/index.php?action=getDealers&asmID=1193
            // LOCAL JSON: js/api/dss/getzones.json
            // TODO --
            url = host+'index.php?action=getDealers&asmID='+$(this).val();
            showLoading();

            $("#dealers").html('<option value="">Select</option>').select2();
            $("#dealer-name").text('-');
            $("#city").text('-');

            $.ajax({
                type: 'GET',
                url: url,
                data: { get_param: 'value' }, 
                dataType: 'json',
                success: function(result){
                    hideLoading();

                    dealers = result.objects;

                    // Assigning Values
                    var selectField = $("#dealers").empty();
                    var t_arr = result.objects;
                    selectField.append("<option value=''>Select</option>");
                    $.each(t_arr, function(_in,_val){
                        selectField.append('<option value="'+_val.dealer_id+'">'+_val.dealer_code+' - '+_val['dealer_name']+'</option>');
                    });

                    selectField.select2();
                }
            });
        });

        // Dealers
        $("#dealers").change(function(){
            
            var dealer_id = $(this).val();
            $.each(dealers,function(index,value){
                if(dealer_id == value.dealer_id){
                    // TODO -- for state
                    $("#dealer-name").text(value.dealer_name);
                    $("#city").text(value.address);
                    return false;
                }
            })
        });

        $("#goBtn").click(function(){
            if(!validateFilter()){
                return false;
            }
            refresh_report();
        });

       localStorage.removeItem('auditID');
       localStorage.removeItem('type_id');
       
});

function get2D( num ) {
    if( num.toString().length < 2 ) // Integer of less than two digits
        return "0" + num; // Prepend a zero!
    return num.toString(); // return string for consistency
}

function load_sideMenus() {

    $.ajax({ 
        type: 'GET', 
        url: host+'index.php?action=sideMenu',
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (sideMenus_data, status) { 

                    $("#bajaj-logo").attr("src", sideMenus_data.header_logo);
                  

                    for(var m=0; m<sideMenus_data.legend.length;m++) {
                        var option_name = sideMenus_data.legend[m].option_name;
                        var option_ID = sideMenus_data.legend[m].option_ID;

                    }
                    $("#side").css("display", "block");
                    $("#dfsc-userImg").css("display", "block");

                    var hashed_value = window.location.hash.substr(1);

                },
            error: function(e){
                console.log(e);
            }
    });
}


// I'll set the options to select box
function buildSelectField(selectId,key,name_id){
    var selectField = $("#"+selectId).empty();
    var t_arr = eval(selectId);
    selectField.append("<option value=''>Select</option>");
    $.each(t_arr, function(_in,_val){
        var name_str = (name_id == undefined) ? "" : '('+_val[name_id]+')';
        selectField.append('<option value="'+_val[key+"_id"]+'">'+_val[key+"_name"]+' '+name_str+'</option>');
    });

    selectField.select2();
}

// Validate Form
function validateFilter(){
    // if(localStorage.getItem())
    // if($("#regions").val() == ""){
    //     alert("Please Select Regions")
    //     return false;
    // }

    // if($("#asms").val() == ""){
    //     alert("Please Select ASM");
    //     return false;
    // }

    if($("#dealers").val() == ""){
        alert("Please Select Dealer");
        return false;
    }

    return true;
}


/* I'll Build the Table of Report via Ajax Call
 */
function refresh_report () {
    // API
    // URL http://localhost/dss_new/apis/dss/index.php?action=getreportAPI&dealer=77&from_date=2015-02-01&to_date=2015-04-04
    // LOCAL JSON: js/api/dss/report_sample.json


    // if($("#regions").val() == "" || $("#asms").val() == "" || $("#dealers").val() == ""){
    if($("#dealers").val() == ""){
        $('#report-data').html('<div class="alert alert-info" style="margin-top: 10px; text-align: center;">Please Select above filters</div>');
        return false;
    }

    // locals
    dealer_id = $("#dealers").val();
    from_date = $("#fromDate").val();
    to_date = $("#toDate").val();
    
    url = host+'index.php?action=getreportAPI&dealer='+dealer_id;

    // Should not Empty
    if(from_date != "" && to_date != ""){
        url += '&from_date='+from_date+'&to_date='+to_date;
    }

    showLoading();
    $('#report-data').html('');

    $.ajax({ 
        type: 'GET', 
        url:  url, 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (report_data) { 
            hideLoading();

            auditSections = report_data.audit_sections;
            auditData = report_data.audit_data;

            if(!auditData.length){
                $('#report-data').html('<div class="alert alert-danger" style="margin-top: 10px; text-align: center;">No Results!</div>');
                return false;
            }

            getAuditSections();

        },
        error: function(e){
            hideLoading();
            console.log(e);
        }
    });

}

function getAuditSections() {
    var table = $("<table/>").attr({'id':'report_table'}).addClass('table table-bordered');
    var thead = $("<thead/>");
    var tbody = $("<tbody/>");
    var tr = $("<tr/>");

    // Table Head
    empty_tr = tr.clone();
    ($("<th/>").css({'border-left':'1px solid transparent','border-right':'1px solid transparent'}).attr({'colspan':(auditData.length + 2)})).appendTo(empty_tr);
    empty_tr.appendTo(thead);
    tr_h = tr.clone();
    ($("<th/>").attr({'colspan':2}).css({'text-align':'center'}).text('Summary of Adherence')).appendTo(tr_h);
    $.each(auditData, function(index,auditDetails){
        tr_h.append("<th style='text-align:center;'><span style='font-weight: normal;'>Audited by <br/>"+auditDetails.audited_by+"</span><br/> "+auditDetails.audited_date+" </th>");
    });
    tr_h.appendTo(thead);
    
       
    // Body TD will build here
    var bodyTd = function(_val,id){
        var bgColor = (parseFloat(_val) < 90) ? "#DB7A77" : "#72d572";
        ($("<td/>").css({'text-align':'center','background-color':bgColor}).text(_val+'%')).appendTo(id);
    };


    // Table Body
    $.each(auditSections, function(index,value){
        
        var curr_tr = tr.clone();
        curr_tr.html("<td rowspan='"+(value.details.length+1)+"' style='text-align:center; vertical-align:middle;'>"+value.process_name+"</td>");
        curr_tr.appendTo(tbody);

        if(value.details.length){
            $.each(value.details, function(k,det){
                var inn_tr = tr.clone();
                inn_tr.append("<td>"+det+"</td>");
                $.each(auditData, function(_index, auditDetails){
                    bodyTd(auditDetails[value.key+'_details'][k], inn_tr); // local method
                });
                inn_tr.appendTo(tbody);
            });
        }

        if(!value.details.length){
            curr_tr.append("<td></td>");
            $.each(auditData, function(_index, auditDetails){
                bodyTd(auditDetails[value.key+'_details'], curr_tr); // local method
            });
        }

    });

    // Total Count
    // I'll give count of array values
    var total = function(_arr){
        var t_total = 0;
        $.each(_arr, function(k,v){
            t_total += parseFloat(v);
        });
        t_total = parseFloat(t_total/_arr.length);

        return t_total.toFixed(2); // Returning the value
    };

    // Total Rows
    var summaryRows = function(key,_val,bgColor,fontColor){
        var s_row = tr.clone();

        if(key == "" && _val == "" && bgColor == ""){
            ($("<td/>").css({'border':'1px solid transparent'}).attr({'colspan':(auditData.length+2)})).appendTo(s_row);
            s_row.appendTo(tbody);
            return false;
        }

        fontColor = (fontColor == undefined) ? "#fff" : fontColor;
        ($("<td/>").attr({'colspan':2}).css({'background-color':bgColor,'text-align':'right', 'color':fontColor}).html(_val)).appendTo(s_row);
        
        s_row.appendTo(tbody);

        if(key != undefined){
            $.each(auditData,function(_index,_auditDetails){

                if(key=="process")
                    var t_arr = _auditDetails['dealer_score_details'];
                else
                    var t_arr = _auditDetails[key+'_details'];

                var t_total = total(t_arr); // Here It'll give 
                bodyTd(t_total,s_row);
            });
        }else{

            // all_totals_arr = [];
            // // TODO --
            // $.each(auditData, function(_in,_aud){
            //     var process_arr = _aud['dealer_score_details'];
            //     total(process_arr);

            //     var manpower_arr = _aud['manpower_details'];
            //     all_totals_arr.push(total(manpower_arr));

            //     var tools_arr = _aud['tools_details'];
            //     all_totals_arr.push(total(tools_arr));

            //     var i_ci_arr = _aud['i_ci_details'];
            //     all_totals_arr.push(total(i_ci_arr));

            //     var grand_total = total(all_totals_arr);
            //     bodyTd(grand_total,s_row);

            //     all_totals_arr = [];
            // });
        }
    };


    summaryRows("","",""); // Empty Row

    summaryRows('process','PROCESS','#00bcd4');

    summaryRows('manpower','MANPOWER', '#00bcd4');
    summaryRows('tools','TOOLS & EQUIPMENT', '#00bcd4');
    summaryRows('i_ci','CI ELEMENT', '#00bcd4');

    // Total
    summaryRows('grand_total','<strong>TOTAL</strong>','#80d8ff','#000');    


    //Appends
    thead.appendTo(table);
    tbody.appendTo(table);
    // Data
    $('#report-data').html(table).css({'color':"#000"});
}