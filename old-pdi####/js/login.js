function  loginCheck(){  
	var un=$('#Email').val();
	var pw=$('#Passwd').val();
    if((un=='bajaj@gladminds.com') && (pw=='bajaj@123')){
        sessionStorage.setItem('username',un);
        window.location = "home.html";
    } else{
        $('.err_msg').css('visibility','visible');
        $("#Passwd,#Email").val('');
        $("#Email").focus();
        return false;
    }
    return false;
}