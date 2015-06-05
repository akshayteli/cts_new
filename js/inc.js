admin_host = "//bajajautomcdss.gladminds.co/apis/dss/dss/";
host = "//bajajautomcdss.gladminds.co/apis/dss/";

prdURL = "http://bajaj.gladminds.co";
apiVersion = prdURL+"/v1/";

qaLogoutURL = apiVersion+"gm-users/logout/";

// admin_host = "//q-bajajauto.gladminds.co/apis/dss/dss/";
// host = "//q-bajajauto.gladminds.co/apis/dss/";


// admin_host = "//localhost/xampp/web/aftersell_dss/apis/dss/dss/";
// host = "//localhost/xampp/web/aftersell_dss/apis/dss/";

// admin_host = "//localhost/aftersell_dss/apis/dss/dss/";
// host = "//localhost/aftersell_dss/apis/dss/";

// admin_host = "//localhost/dss1/dss/apis/dss/dss/";
// host = "//localhost/dss1/dss/apis/dss/";

$(document).ready(function(){
  $.ajaxSetup({ cache: false });
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

        $("#logout-user").click(function(){
            logoutUser();
        });

        $(".go_back_arrow").click(function(){
          window.history.back();
        })

});

function showLoading(){
    $("#loading").show();
}

function hideLoading(){
    $("#loading").hide();
}


function getParameterByName(url) {
    url = url.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + url + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ajaxStop(function() {
   $("#loading").hide();
});

function logoutUser(){
  // http://qa.bajaj.gladminds.co/v1/gm-users/logout/?access_token=
  var logoutUrl = qaLogoutURL+"?access_token="+localStorage.getItem('access_token');
  showLoading();
  $.ajax({
      url: logoutUrl,
      success: function(data){
        $("#logout-window").modal('hide');
        hideLoading();
        // bootbox.alert(data.message,function(){
        localStorage.clear();
        window.location.href = "index.html";
        // });        
      },
      error:function(){
          alert("logout failure");
          hideLoading();
          return false;
      }
  });
}


function ajaxify(formObj,successfunction){
  showLoading();
  var values = $("#"+formObj).serialize();
  testURL = host+"index.php";

  $.ajax({
      url: testURL,
      type: "post",
      data: values,
      success: function(data){

          data = $.parseJSON(data);
          
          if(data.status==1){
            var x = successfunction(formObj);
          }

          hideLoading();
          
          return false;

      },
      error:function(){
          alert("failure");
          if(x!=1)
            hideLoading();
          return false;
      }
  });

  return false;
}

function ajaxifyAudit(formObj,successfunction){
  showLoading();
  var values = $("#"+formObj).serialize();
  testURL = host+"index.php";

  $.ajax({
      url: testURL,
      type: "post",
      data: values,
      success: function(data){

          data = $.parseJSON(data);
          
          if(data.status==1){
            var x = successfunction(formObj);
          }

          hideLoading();
          
          return false;

      },
      error:function(){
          alert("failure");
          if(x!=1)
            hideLoading();
          return false;
      }
  });

  return false;
}

function ajaxifyAdmin(formObj,successfunction){
  showLoading();
  var values = $("#"+formObj).serialize();
  testURL = admin_host+"index.php";

  $.ajax({
      url: testURL,
      type: "post",
      data: values,
      success: function(data){

          data = $.parseJSON(data);
          
          if(data.status==1){
            var x = successfunction(formObj);
          }

          hideLoading();
          
          return false;

      },
      error:function(){
          alert("failure");
          if(x!=1)
          	hideLoading();
          return false;
      }
  });

  return false;
}

function ajaxifyForm(formID,redirectPage){

    showLoading();
    debugger;
    var values = $("#"+formID).serialize();
    testURL = host+"index.php";

$.ajax({
    url: testURL,
    type: "post",
    data: values,
    success: function(data){
        alert("data")
        data = $.parseJSON(data);

if(data.status==1){
    $(".alert").removeClass("alert-danger").addClass("alert-success").html(data.message).css("display","block");
    hideLoading();
}
else{
    alert("failure")
    hideLoading()
}

return false;

},
error:function(){
    alert("failure");
    hideLoading();
    return false;
}
});
}



var path = window.location.pathname;
path = path.substring(path.lastIndexOf("/")+ 1);

if(path != "menu.html") {
    var user = localStorage.getItem("username")
    var profile_img_path = localStorage.getItem("profile_img");

    var menus = '<li class="side-user hidden-xs"><img class="img-responsive" src='+profile_img_path+' alt=""><p class="welcome"><i class="fa fa-key"></i> Logged in as</p><p class="name tooltip-sidebar-logout text-center" style="margin-left:0px;"><span>'+user+'</span><a data-toggle="modal" data-target="#logout-window" class="bajaj-user-logout" style="color: inherit;display:block;color:#6d6d6d;font-size:14px;text-decoration:none;" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="Logout">Logout <i class="fa fa-sign-out"></i></a></p><div class="clearfix"></div></li>';


        $("#side").append(menus);

    var logout_user = '<img class="img-circle img-logout" src='+profile_img_path+' alt=""><p><strong>'+user+'</strong></p>';

    $("#logout-modal-img").append(logout_user);    
}

function relogin() {
    localStorage.clear();
    window.location.href = "/";
}

// Validation
$(document).on('keypress', '.technicianName, .input_customerName', function(event){
     var inputValue = event.charCode;
     if(( (inputValue > 32 && inputValue < 65) || (inputValue > 90 && inputValue < 97) || (inputValue > 122 && inputValue < 127 )  ) && (inputValue != 32) ){
        event.preventDefault();
     }
});

$(document).on('paste', '.technicianName, .input_customerName', function(event){
    var t = this;

    event.preventDefault();

    // setTimeout(function() {
    //     var trimNumbersReg = /[^A-Za-z]+/ig;
    //     var s = $(t).val();
    // d = s.replace(/[^\w\s]/gi, '')
    //     var noLetters = s.replace(trimNumbersReg, '');
    //     console.log(noLetters);
    //     $(t).val(noLetters);    
    // }, 100);
    


     // var inputValue = event.charCode;
     // if(( (inputValue > 32 && inputValue < 65) || (inputValue > 90 && inputValue < 97) || (inputValue > 122 && inputValue < 127 )  ) && (inputValue != 32) ){
     //    event.preventDefault();
     // }
});

$(document).on('drop', '.technicianName, .input_customerName', function(event){
    event.preventDefault();
});


$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};