host = "//bajajautomcdss.gladminds.co/apis/dss/";
qaLoginURL = "//bajaj.gladminds.co/v1/gm-users/login/";

// host = "//localhost/dss1/dss/apis/dss/";

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

					        				$("#user-reg-form").append(input_fields);
					        			}
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


$("#signIn").on('click', function(e){
  	// e.preventDefault();
  	// $("#error-msg-login-window").css("display", "none");

  	// showLoading();
 //  	var un=$('#Email').val();
	// var pw=$('#Passwd').val();
	// alert('un');
 //    if((un=='bajaj@gladminds.com') && (pw=='bajaj@123')){
 //        sessionStorage.setItem('username',un);
 //        // window.location = "home.html";
 //    } else{
 //        $('#err_msg').css('visibility','visible');
 //        alert('error')
 //        $("#Passwd,#Email").val('');
 //        $("#Email").focus();
 //        return false;
 //    }
  var input_email = $("#Email").val();
  var email = input_email.trim();
  alert('hi');

  var input_password = $("#Passwd").val();
  var password = input_password.trim();

  // var pwd_encrypted = $.md5(password);
  var pwd_encrypted = password;

        var formData = {"username":email,"password":pwd_encrypted}
        serilizedData = JSON.stringify(formData);
        //console.log(formData)

    //     $.ajax({
    //         url : qaLoginURL,
    //         type: "POST",
    //         cache: false,
    //         data: serilizedData,
    //         success: function(data, resp){	
    //         	//console.log(data)
    //         	if (data.status == 1) {
    //         		localStorage.setItem("access_token", data.access_token);
    //         		var txtPermissions = getPermissions(data);
            		
    //         	} else {
    //                 $("#error-msg-login-window").css("display", "block");   
    //                 hideLoading();
    //             }
    //         },
    //         error: function(error)
    //         {
    //         	hideLoading();
    //             $(".error-msg-login-window").css("display", "block");
    //         }
    // });

});



	$("#register-user").click(function() {
		var first_name = $("input[name=first_name]").val();
		var last_name = $("input[name=last_name]").val();
		var mobile = $("input[name=phone_no]").val();
		var email = $("input[name=email_address]").val().trim();

		if (ValidateFirstName(first_name) && ValidateLastName(last_name) && Validatephonenumber(mobile) && ValidateEmail(email)) {
				console.log("Everything fine");
				$(".reg-input-blocks").val("");
				window.location = "index.html";
		}
		else {
			$(".error-log-block").css("display", "block");
        	$(".error-log-block").html("Something went wrong!! Please try again");
		}
	});


});


// var getPermissions = function(data) {
// 	var userInfo = {"access_token":data.access_token,"userID":data.user_id};
// 	//console.log(userInfo);

// 	$.ajax({
// 		url : host+'index.php?action=loginCheck',
// 		type : 'POST',
// 		dataType : 'json',
// 		data : {"access_token":data.access_token,"userID":data.user_id},
// 		success : function(userData, status) {
// 					// console.log(userData);

// 					localStorage.setItem('user_name', userData.name);
// 					localStorage.setItem('username', userData.username)
//             		localStorage.setItem('user_id', userData.userid);
//             		localStorage.setItem('user_type', userData.role);
//             		localStorage.setItem('area', userData.area);
//                     localStorage.setItem("authUser", userData.user_type);
//                     localStorage.setItem("rec_id", userData.rec_id);

// 					window.location.href = "menu.html";	
// 		},
// 		error : function(e) {
// 			console.log(e)
// 		}
// 	})
// }

function showLoading(){
    $("#loading").show();
}

function hideLoading(){
    $("#loading").hide();
}
