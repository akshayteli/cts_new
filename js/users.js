// host = "js/api/dss/";

var LOCAL = false;

 $(document).ready(function(){
    
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


        if(localStorage.getItem('user_type') == "5") // Super Admin
            $('textchange').text('All RSMs');
        else if(localStorage.getItem('user_type') == '1') // Admin
            $('textchange').text('All ASMs');
        else if(localStorage.getItem('user_type') == '2') // ASMs
            $('textchange').text('All Dealers');


        load_sideMenus();

        
        /*other API calls*/

        refresh_users();
        $('#users_data').find('table').dataTable();

       localStorage.removeItem('auditID');
       localStorage.removeItem('type_id');
       

});

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

function refresh_users() {
    var headers = ["id", "name", "email", "mobile"];
    var fields = [];
    var editable = false;
    var accessURL = false;
    var zsm_url = "";

    // API
    // URL http://localhost/dss_new/apis/dss/index.php?action=getDealers&asmID=1193
    // LOCAL JSON: js/api/dss/user.json
    var url = "";
    var createURI = "";
    var updateURI = "";
    var deleteURI = "";
    
    // Based On Roles
    // For Super Admin
    if(localStorage.getItem("user_type") == "5"){ // Super Admin
        // APIs
        url = apiVersion+"zonal-service-managers/?limit=1000&access_token="+localStorage.getItem('access_token');  
        createURI = apiVersion+"zonal-service-managers/register/?access_token="+localStorage.getItem('access_token');
        updateURI = apiVersion+"zonal-service-managers/update/";//+localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
        deleteURI = prdURL; // /v1/zonal-service-managers/"+localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
        // Others
        headers = ["Employee Code", "Employee name", "email", "mobile"];
        fields = ["zsm_id", "user.user.first_name", "user.user.email", "user.phone_number"];
    }

    if(localStorage.getItem("user_type") == "1"){ // RSMs
        // APIs
        url = apiVersion+"area-service-managers/?limit=1000&access_token="+localStorage.getItem('access_token')+"&limit=10000"; //"getAsms&zsm_id="+localStorage.getItem("rec_id"); // For Admin (RSM)
        createURI = apiVersion+"area-service-managers/register/?access_token="+localStorage.getItem('access_token');
        updateURI = apiVersion+"area-service-managers/update/";//+localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
        deleteURI = prdURL;//+localStorage.getItem('user_id')+"/?access_token="+localStorage.getItem('access_token');
        // Others
        headers = ["Employee Code", "Employee name", "email", "mobile"];
        fields = ["asm_id", "user.user.first_name", "user.user.email", "user.phone_number"];
    }

    if(localStorage.getItem('user_type') == "2"){ // Asms
        // APIs
        url = apiVersion+"dealers/?limit=1000&access_token="+localStorage.getItem('access_token');  //"getDealers&asmID="+localStorage.getItem("rec_id"); // For Auditor (ASM)
        // Others
        headers = ["Dealer Code", "Dealer name", "email", "mobile"];
        fields = ["dealer_id", "user.user.first_name", "user.user.email", "user.phone_number"];
    }


    if(localStorage.getItem("user_type") == "5" || localStorage.getItem("user_type") == "1")
        editable = true;

    if(localStorage.getItem("user_type") == "1"){
        accessURL = true;
        zsm_url = apiVersion+"zonal-service-managers/?access_token="+localStorage.getItem('access_token')+"&user="+localStorage.getItem('user_id');
    }


    $("#users_data").usersTable({
        // apiUrl: apiVersion+"gm-users/",
        apiUrl: url,
        fields: fields,
        headers: headers,
        editable: editable,
        modalHeading: [0,1],

        role: localStorage.getItem('user_type'),

        getZonesUrl: host+'index.php?action=getzones',

        curdAPIs: {
            create: createURI,
            update: updateURI,
            del: deleteURI
        },
        
        accessURL: accessURL,
        accessIDAPI: zsm_url,
        userID: localStorage.getItem('user_id'),
        accessToken: localStorage.getItem('access_token'),

        // edit: function(data){
        //     console.log(data);
        // }
    });

    
    // $("#users_data").find('table').dataTable();
}