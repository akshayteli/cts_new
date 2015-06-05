var user_profileImg;

$(document).ready(function(){
showLoading();

	$.ajax({
		type: 'GET',
		url: host+'index.php?action=mainMenu',
		data: { get_param: 'value' }, 
        dataType: 'json',
        success: function(mainMenu_data, status){

            var box_id = [{"id" : "1"},{"id" : "2"},{"id" : "3"},{"id" : "4"}]

                $("#bajaj-logo").attr('src', mainMenu_data.brand_logo);

                $("#user-login-name").text(mainMenu_data.user);
                $("#logout-user-name").text(mainMenu_data.user);

                localStorage.setItem("profile_img", mainMenu_data.profile_img);
                localStorage.setItem("username", mainMenu_data.user);



                var user = localStorage.getItem("username")
var profile_img_path = localStorage.getItem("profile_img");

var menus = '<li class="side-user hidden-xs"><img class="img-responsive" src='+profile_img_path+' alt=""><p class="welcome"><i class="fa fa-key"></i> Logged in as</p><p class="name tooltip-sidebar-logout text-center" style="margin-left:0px;"><span>'+user+'</span><a data-toggle="modal" data-target="#logout-window" class="bajaj-user-logout" style="color: inherit;display:block;color:#6d6d6d;font-size:14px;text-decoration:none;" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="Logout">Logout <i class="fa fa-sign-out"></i></a></p><div class="clearfix"></div></li>';


    $("#side").append(menus);

var logout_user = '<img class="img-circle img-logout" src='+profile_img_path+' alt=""><p><strong>'+user+'</strong></p>';

$("#logout-modal-img").append(logout_user);






                $(".side-user img").attr("src",mainMenu_data.profile_img);
                $(".side-user p span").text(mainMenu_data.user)
                $(".img-logout").attr("src",mainMenu_data.profile_img);
                $(".userNameHolder").html(mainMenu_data.username)
              

        	for (var i=0;i<mainMenu_data.legends.length;i++) {
        		var option_name = mainMenu_data.legends[i].option_name;
        		var className = mainMenu_data.legends[i].className;
                var url = mainMenu_data.legends[i].img_path;

				var main_html = '<div class="col-lg-3 col-xs-12 options-block links_blk_'+box_id[i].id+'"><div class="clearfix menuTable-wrapper"><div class="portlet '+className+' "><div class="portlet-heading"><div class="portlet-title"><h4>'+option_name+'</h4></div><div class="clearfix"></div></div><div id="orangePortlet" class="panel-collapse collapse in"><div class="portlet-body"><ul class="menu-options-list">';

        		for(var j=0;j<mainMenu_data.legends[i].url.length;j++) {
        			
        			var service_name = mainMenu_data.legends[i].url[j].name;
        			var service_url = mainMenu_data.legends[i].url[j].href;

                    if(service_url == "#") {
                        $(".page-links").attr("data-original-title", "Coming Soon...");
                        main_html +='<li><i class="fa fa-arrow-right mainMenu-arrow"></i><a class="page-links" href='+service_url+' data-toggle="tooltip" data-placement="right" title="Coming Soon">'+service_name+'</a></li>';
                    }
                    else {
        			     main_html +='<li><i class="fa fa-arrow-right mainMenu-arrow"></i><a class="page-links" href='+service_url+' >'+service_name+'</a></li>';
                    }

        		}

            main_html+='</ul></div><div class="category-image" style="background:url('+url+')no-repeat;"></div></div></div></div></div>';
            
			$("#mainMenu-area").append(main_html);	
            hideLoading();
            var permission = localStorage.getItem("permission");

            //console.log(mainMenu_data.id)
             if (localStorage.getItem("authUser") != "Admins") {
                $(".links_blk_2").css("display", "none");
                $(".links_blk_3").css("display", "none");
                $(".links_blk_4 ").css("display", "none");
            }

        	}
        }
	});
    
});

function getParameterByName(url) {
    url = url.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + url + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
