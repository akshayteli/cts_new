function ValidateFirstName(firstName) {
    var returnVal = true;
    if (firstName != "") {
        var regex = /^[a-zA-Z ]{2,30}$/;
        if (regex.test(firstName)) {
            returnVal = true;
        }
        else {
            $(".error-log-block").css("display", "block");
            $(".error-log-block").html("Please Enter Your Correct Name");
            returnVal = false;
        }
    }
    else {
        // console.log("Please Enter Your Name"); 
        $(".error-log-block").css("display", "block");
        $(".error-log-block").html("Please Enter Your First Name");
        returnVal = false;
    }
    return returnVal;
}

function ValidateLastName(lastName) {
    var returnVal = true;
    if (lastName != "") {
        var regex = /^[a-zA-Z ]{1,30}$/;
        if (regex.test(lastName)) {
            returnVal = true;
        }
        else {
            console.log("Please Enter correct Name");
            returnVal = false;
        }
    }
    else {
        $(".error-log-block").css("display", "block");
        $(".error-log-block").html("Please Enter Your Last Name");
        returnVal = false;
    }
    return returnVal;
}




function ValidateEmail(email) {
    if (email == "") {
        $(".error-log-block").css("display", "block");
        $(".error-log-block").html("Please Enter Your Email ID");
    }
    else {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email.match(mailformat)) {
            if(email.indexOf("@"+domain, email.length - "@"+domain.length) !== -1){
                console.log("VALID ID");
                return true;
            } 
            else {
                $(".error-log-block").css("display", "block");
                $(".error-log-block").html("Please Enter Correct Domain");
                return false;
            }
            
        }
        else {
                $(".error-log-block").css("display", "block");
                $(".error-log-block").html("Please Enter Your Valid Emial ID");
                return false;
        }
    }
}


//phone number of 10 digits with no comma, no spaces, no special characters and there will be no + sign in front the number.

function Validatephonenumber(phonenumber) {
    if (phonenumber == "") {
        $(".error-log-block").css("display", "block");
        $(".error-log-block").html("Please Enter Your Mobile Number");
        return false;
    }
    else {
        var phoneno = /^\d{10}$/;
        if (phonenumber.match(phoneno)) {
            return true;
        }
        else {
            $(".error-log-block").css("display", "block");
            $(".error-log-block").html("Please Enter Correct Mobile Number");
            return false;
        }
    }
    
}
