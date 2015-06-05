
var domain;
$(document).ready(function(){
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
});
function  loginCheck(){
    // var producturl="http://api.afterbuy.co/afterbuy/v1/consumers/product-details/?access_token=<>";
    var un=$('#Email').val();
    var pw=$('#Passwd').val();
    var formData={"login_id": un,"password":pw};
    serilizedData = JSON.stringify(formData);
    if(un=="" || pw==""){
        $('#error-msg').css('visibility','visible');
        $("#Passwd,#Email").val('');
        $("#Email").focus();
        return false;
    }else{
        // sessionStorage.setItem('username',un);
        // window.location = "home.html";
        $.ajax({
            type: 'POST', 
            url:'//qa.bajaj.gladminds.co/v1/gm-users/login/', 
            data:{"login_id": un,"password":pw}, 
            dataType: 'json',
            success: function (log_data, status) {
                sessionStorage.setItem('username',log_data.login_id);
                sessionStorage.setItem('user_group',log_data.user_group);
                sessionStorage.setItem('rep_manager',log_data.rep_manager_id);
                // alert(log_data.login_id+","+log_data.user_group+","+log_data.rep_manager_id);
                window.location = "home.html";
                    
            },
            error: function(e){
                $('#error-msg').css('visibility','visible');
                $("#Passwd,#Email").val('');
                $("#Email").focus();
                return false;
            }
        });
    } 
    return false;
}