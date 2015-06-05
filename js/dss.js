// host = "js/api/dss/";

if ((localStorage.getItem("username") == null) || (profile_img_path = localStorage.getItem("profile_img") == null)) {
    relogin();
}

 $(document).ready(function(){
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




        load_sideMenus();

        
        /*other API calls*/

        refresh_dashboard();

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

function refresh_dashboard() {
    showLoading();

    $.ajax({ 
        type: 'GET', 
        url:  host+'index.php?action=getDashBoardData', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (dashboard_data, status) { 

                var dashboard_color = [{"color":"#064FA6"},{"color":"#FE7033"},{"color":"green"},{"color":"#ff0099"},{"color":"#064FA6"}];
                $("#dashboard_area").html("");

                for (var i=0;i<dashboard_data.objects.length;i++) {
                    var dashboard_count = dashboard_data.objects[i].value;
                    var dashboard_type = dashboard_data.objects[i].name;
                    var id = dashboard_data.objects[i].id;

                    var id = dashboard_data.objects[i].id;

                    var icon_name = dashboard_data.objects[i].icon_name;

                    var redirect = dashboard_data.objects[i].more_info;
                    var url =  redirect+ "?id=" + id;

                    if(dashboard_data.objects[i].value == "+") {
                        var dashboard_area = '<div class="col-lg-2 col-sm-6 col-xs-6" style="height:236px;" onclick="redirectPage(\''+id+'\',\''+url+'\')"><div class="circle-tile dss-dashboard-blk"><a href="#"><div class="circle-tile-heading" style="background: '+dashboard_color[i].color+' "><i class="fa fa-fw fa-3x '+icon_name+'"></i></div></a><div class="circle-tile-content" style="background: '+dashboard_color[i].color+' "><div class="circle-tile-description">'+dashboard_type+'</div><div class="circle-tile-number text-faded"><a href="#" class="add-new">+</a></div><a href='+url+' class="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div></div>';
                    } else {
                        var dashboard_area = '<div class="col-lg-2 col-sm-6 col-xs-6" style="height:236px;" onclick="redirectPage(\''+id+'\',\''+url+'\')"><div class="circle-tile dss-dashboard-blk"><a href="#"><div class="circle-tile-heading" style="background: '+dashboard_color[i].color+' "><i class="fa fa-fw fa-3x '+icon_name+'"></i></div></a><div class="circle-tile-content" style="background: '+dashboard_color[i].color+' "><div class="circle-tile-description">'+dashboard_type+'</div><div class="circle-tile-number text-faded"><span id="dashboard-box">'+dashboard_count+'</span></div><a href=#" class="circle-tile-footer">More Info <i class="fa fa-chevron-circle-right"></i></a></div></div></div>';
                    }

                    $("#dashboard_area").append(dashboard_area);
                    hideLoading();
                }

                $("#dashboard").css("display", "block");

                // Text Changing
                if(localStorage.getItem('user_type') == "5") // Super Admin
                    $($('a[href*="users"]')[0]).parent().find('.circle-tile-description').text('All RSMs');
                else if(localStorage.getItem('user_type') == '1') // Admin
                    $($('a[href*="users"]')[0]).parent().find('.circle-tile-description').text('All ASMs');
                else if(localStorage.getItem('user_type') == '2') // ASMs
                    $($('a[href*="users"]')[0]).parent().find('.circle-tile-description').text('All Dealers');
                
            },
        error: function(e){
            hideLoading();
            console.log(e);
        }
    });
            
}


function redirectPage(id,url){
    localStorage.setItem("subStatus", id);
    location.href = url;
}