
var domain;
$(document).ready(function(){

	$('#Passwd').bind("cut copy paste",function(e) {
  		// e.preventDefault();
  	});

	$.ajax({ 
        type: 'GET', 
        url: 'js/api/index.json', 
        dataType: 'json',
        success: function (brandIndex, status) { 

        		domain = brandIndex.domain_name;

            	var brand_img = '<img class="img-responsive logo" src='+brandIndex.logo_url+'>';

            	$("#brand_image").append(brand_img);

            	$("#brand_name").text(brandIndex.product + "!");

            	if (brandIndex.user_register == 1) {
            		$(".oneApp-bajaj").css("display", "block");

					$.ajax({ 
				        type: 'GET', 
				        url: host+'register.json', 
				        dataType: 'json',
				        success: function (registration_form_data, status) { 
				        			
				        			for (var i=0;i<registration_form_data.legend.length;i++) {
				        				var reg_data = registration_form_data.legend;

				        				var input_fields = '<h4 class="page-header reg-form-header col-md-12">'+registration_form_data.legend[i].type+'</h4>';
				        				for (var j=0;j<reg_data[i].fields.length;j++) {
				        					

				        					if (reg_data[i].fields[j].mandatory == "0") {

				        						input_fields+= '<div class="form-group col-md-'+reg_data[i].fields[j].span+' "><label>'+reg_data[i].fields[j].label+'</label><input type='+reg_data[i].fields[j].input_type+' class="reg-input-blocks form-control" name='+reg_data[i].fields[j].fld_name+'></div>';
				        						
				        					}
				        					else {
				        						input_fields+= '<div class="form-group col-md-'+reg_data[i].fields[j].span+' "><label>'+reg_data[i].fields[j].label+'<span class="mandatory_field"><sup>*</sup></span></label><input type='+reg_data[i].fields[j].input_type+' class="form-control reg-input-blocks" name='+reg_data[i].fields[j].fld_name+'></div>';
				        					}
				        				
				        					
				        					
				        				}

				        					

				        				$("#user-reg-form").append(input_fields);
				        			}


				            	},
				        error: function(e){
				            console.log(e);
				        }
				    });

            	}
            	else {
            		$(".new-user-reg").css("display", "none");
            	}

            	$(".index-page-wrapper").css("display", "block");
            },
        error: function(e){
            console.log(e);
        }
    });


	$("#signIn").bind('click', function(e){
		//alert("un")
		showLoading();
		e.preventDefault();
		var input_email = $("#Email").val();
		var email = input_email.trim();

		var input_password = $("#Passwd").val();
		var password = input_password.trim();

		if (ValidateEmail(email)) {

		serilizedData = $("#gaia_loginform").serialize();

     	$.ajax({
            url : host+"index.php?action=loginCheck",
            type: "post",
			cache: false,
			data: serilizedData,
            success: function(data, resp)
            {	
            	hideLoading();
            	data = $.parseJSON(data);
                
                if (data.status == 1) {
                	var imgUrl = data.img_url;
                	var user_pic = imgUrl.replace(/\//g, '/');
                	localStorage.setItem("permission", "1");
                	localStorage.setItem('profile_img', 'img/profile_pics/'+user_pic);
            		localStorage.setItem('user_name', data.name);

            		localStorage.setItem('user_type', data.user_type);

                	window.location = "menu.html";
                }
                else{
                	$(".error-msg-login-window").css("display", "block");
                }
            },
            error: function(error)
            {
            	hideLoading();
                $(".error-msg-login-window").css("display", "block");

            }
        });
		}
		else {
			$(".error-msg-login-window").css("display", "block");
		}

		// if (((email=="rkjena@bajajauto.co.in")&&(password="a1z269ps5!d2")) || ((email=="kumarashish@bajajauto.co.in")&&(password="a1z269ps5!d2"))) {
		// 	if (email == "rkjena@bajajauto.co.in") {
		// 		window.location.href = "menu.html?user=76af1de5e818cdd6a2b668d822fa1ad2";	
		// 	}
		// 	if (email == "kumarashish@bajajauto.co.in") {
		// 		window.location.href = "menu.html?user=599099fa9262e67691737707336e9338";	
		// 	}
			
		// }
		// else {
		// 	$(".error-msg-login-window").css("display", "block");
		// }
		 

	});


	$("#register-user").click(function() {
		var first_name = $("input[name=first_name]").val();
		var last_name = $("input[name=last_name]").val();
		var mobile = $("input[name=phone_no]").val();
		var email = $("input[name=email_address]").val().trim();

		// console.log(first_name);
		// console.log(last_name);
		// console.log(mobile);

		if (ValidateFirstName(first_name) && ValidateLastName(last_name) && Validatephonenumber(mobile) && ValidateEmail(email)) {
				console.log("Everything fine");
				$(".reg-input-blocks").val("");
				window.location = "index.html";
		}
		else {
			// console.log("Oops!! Something went wrong");
			$(".error-log-block").css("display", "block");
        	$(".error-log-block").html("Something went wrong!! Please try again");
		}
	});


});

function Login() {
	
		var email = $("#user-email").val();
		var password = $("#user-password").val();

		var sessionTimeout = 1; //hours
		var loginDuration = new Date();
		loginDuration.setTime(loginDuration.getTime()+(sessionTimeout*60*60*1000));
		document.cookie = "CrewCentreSession=Valid; "+loginDuration.toGMTString()+"; path=/";


		// Put this at the top of index page
		if (document.cookie.indexOf("CrewCentreSession=Valid") == -1) {
		  location.href = "index.html";
		}

		if ((email=="rkjena@bajajauto.co.in") && (password == "rkjena123")) {
			self.location.href = "menu.html";
		}
		else {
			alert("Either the username or password you entered is incorrect.\nPlease try again.");
			$("#user-email").focus();
		}
		return true;
}