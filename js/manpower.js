function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function sumup(){
	sum=0;
	$(".cell_4").each(function(){
		sum+= parseInt($(this).html())
	});

	$(".row16 .cell_4").html(sum)
}

function calcValues(){

	
	E5 = $("#txt_AMSV").val();
	E6 = $("#txt_AMPV").val();
	G5 = $("#txt_ds1").val();
	G6 = $("#txt_dp1").val();
	G7 = Math.ceil(G5);
	G8 = Math.ceil(G6);
	G9 = G7 + G8 ;

	$(".row1 .cell_5").html((E5>0)?1:0);
	$(".row2 .cell_5").html((G5>0)?(Math.ceil(G5/20,0)):0);
	$(".row3 .cell_5").html((G5>0)?((G5<=20)?"Clubbed with SA's Job role":Math.ceil(G5/40,0)):0);
	$(".row4 .cell_5").html((G5>0)?((G5<=20)?"Clubbed with WM's Job role":Math.ceil(G5/40,0)):0);
	$(".row5 .cell_5").html((G5>0)?((G5<=40)?"Clubbed with WM's Job role":1):0); 
	$(".row6 .cell_5").html((G5>0)?Math.ceil(G5/5,0):0);
	$(".row7 .cell_5").html((G5>0)?((G5<=20)?"One of the PM technician must be expert":Math.ceil(G5/40,0)):0);	
	$(".row8 .cell_5").html((G5>0)?((G5<=20)?"One of the PM technicians must be Final Inspector":Math.ceil(G5/40,0)):0);
	$(".row9 .cell_5").html((G5>0)?((G5<=40)?"One of the PM technicians must be Product specialist":1):0); 
	$(".row10 .cell_5").html((E5>0)?1:0);
	$(".row11 .cell_5").html((G5>0)?((G5<=20)?"Clubbed with Spare Manager's Job role":Math.ceil(G5/50,3)):0);
	$(".row12 .cell_5").html((G5>0)?((G5<=40)?"Clubbed with SA's Job role":1):0); 
	$(".row14 .cell_5").html((E6>0)?((G6<=40)?"Clubbed with WM's Job role":1):0); 
	$(".row13 .cell_5").html((G5>0)?Math.ceil(((G9)/40)):0);
	$(".row15 .cell_5").html((G6>0)?Math.ceil(G6/20,0):0);

	if($("#txt_AMSV").val()>0 && $("#txt_AMPV").val()>0)
	{
				$(".rowTemplate input").removeAttr("disabled")
	}
	else
	{
		$(".rowTemplate input").val("").attr("disabled","true")
	}
}



$(document).ready(function(){

	

	maxScore = 0;
	$( ".cell_3" ).each(function( index ) {
		if($(this).text() != "") {
			maxScore += parseInt($(this).text())
		}
	    $(".txtMaxScore").text(maxScore);
	    // $("#manpower_dealerScore").val()
	    
	});




	$("#txt_AMSV").keyup(function(){
		$("#txt_ds").html(parseFloat($(this).val())/25);
		maxScore = 0;
		$( ".cell_3" ).each(function( index ) {
		if($(this).text() != "") {
			maxScore += parseInt($(this).text())
		}

	
	    $(".txtMaxScore").text(maxScore);
	});
	// console.log("total==>"+ total);
		calcValues();
	})

	$("#txt_AMPV").keyup(function(){
		$("#txt_dp").html(parseFloat($(this).val())/25);
		calcValues();
	});



	$("#txt_AMSV").keyup(function(){
		$("#txt_ds1").val(($(this).val())/25);
		calcValues();
	})

	$("#txt_AMPV").keyup(function(){
		$("#txt_dp1").val(($(this).val())/25);
		calcValues();
	});

	
		$(document).on("keyup",".row1.rowTemplate input, .row2.rowTemplate input,.row6.rowTemplate input,.row10.rowTemplate input,.row13.rowTemplate input,.row15.rowTemplate input",function(){

		rowObj = $(this).parent().parent();
		expectedVal = parseFloat($(rowObj).find(".cell_5").html());
		$(rowObj).find(".cell_4").html("")
		
		newVal = parseFloat($(rowObj).find(".cell_3").html());
		if(jQuery.type(expectedVal)=="number"){
			if($(this).val()>=expectedVal){
				$(rowObj).find(".cell_4").html(newVal);
				
			}
			else{
				$(rowObj).find(".cell_4").html(Math.round(($(this).val()/expectedVal)*newVal));
				
			}
		}
		sumup();

	})



	$(document).on("focus, keyup",".row3.rowTemplate input",function()
	{
		
		rowObj = $(this).parent().parent();
		rowObj1 = $(this).parent().parent().prev().find(".cell_4");
		newVal1 = 15;
		newVal2 = 0;
		expectedVal1 = $(rowObj).find(".cell_5").html();
		$(rowObj).find(".cell_4").html("")
		newVal = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt1 = parseInt(expectedVal1);
		

		cond = (expectedVal1==""+expectedValInt1+"")

		//debugger;

		if(cond)
		{
		
			enteredValue1 = parseFloat($(this).val());
			expectedVal1 = parseFloat(expectedVal1);

			if(enteredValue1>=expectedVal1){
				
				$(rowObj).find(".cell_4").html(newVal);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue1/expectedVal1)*newVal));
			}
		}

		else
		{
			
			if($(rowObj1).html()==20)
			{
					$(rowObj).find(".cell_4").html(newVal1);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal2);
			}

		}


	})
	$(document).on("focus, keyup",".row4.rowTemplate input",function()
	{

		rowObj = $(this).parent().parent();
		rowObj41 = $(this).parent().parent().prev().prev().prev().find(".cell_4");
		newVal41 = 20;
		newVal42 = 0;
		expectedVal4 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal4);
		$(rowObj).find(".cell_4").html("")
		newVal4 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt4 = parseInt(expectedVal4);
		

		cond = (expectedVal4==""+expectedValInt4+"")

		//debugger;

		if(cond)
		{
		
			enteredValue4 = parseFloat($(this).val());
			expectedVal4 = parseFloat(expectedVal4);

			if(enteredValue4>=expectedVal4){
				
				$(rowObj).find(".cell_4").html(newVal4);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue4/expectedVal4)*newVal4));
			}
		}

		else
		{
			
			if($(rowObj41).html()==20)
			{
					$(rowObj).find(".cell_4").html(newVal41);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal42);
			}

		}



	})
		$(document).on("focus, keyup",".row5.rowTemplate input",function()
	{
		rowObj = $(this).parent().parent();
		rowObj51 = $(this).parent().parent().prev().prev().prev().prev().find(".cell_4");
		newVal51 = 15;
		newVal52 = 0;
		expectedVal5 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal);
		$(rowObj).find(".cell_4").html("")
		newVal5 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt5 = parseInt(expectedVal5);
		

		cond = (expectedVal5==""+expectedValInt5+"")

		//debugger;

		if(cond)
		{
		
			enteredValue5 = parseFloat($(this).val());
			expectedVal5 = parseFloat(expectedVal5);

			if(enteredValue5>=expectedVal5){
				
				$(rowObj).find(".cell_4").html(newVal5);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue5/expectedVal5)*newVal5));
			}
		}

		else
		{
			
			if($(rowObj51).html()==20)
			{
					$(rowObj).find(".cell_4").html(newVal51);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal52);
			}

		}


	})
	$(document).on("focus, keyup",".row7.rowTemplate input",function()
	{
		rowObj = $(this).parent().parent();
		rowObj71 = $(this).parent().parent().prev().find(".cell_4");
		newVal71 = 15;
		newVal72 = 0;
		expectedVal7 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal4);
		$(rowObj).find(".cell_4").html("")
		newVal7 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt7 = parseInt(expectedVal7);
		

		cond = (expectedVal7==""+expectedValInt7+"")

		//debugger;

		if(cond)
		{
		
			enteredValue7 = parseFloat($(this).val());
			expectedVal7 = parseFloat(expectedVal7);

			if(enteredValue7>=expectedVal7){
				
				$(rowObj).find(".cell_4").html(newVal7);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue7/expectedVal7)*newVal7));
			}
		}

		else
		{
			
			if($(rowObj71).html()==50)
			{
					$(rowObj).find(".cell_4").html(newVal71);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal72);
			}

		}

	})	
	$(document).on("focus, keyup",".row8.rowTemplate input",function()
	{
		rowObj = $(this).parent().parent();
		rowObj81 = $(this).parent().parent().prev().prev().find(".cell_4");
		newVal81 = 20;
		newVal82 = 0;
		expectedVal8 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal);
		$(rowObj).find(".cell_4").html("")
		newVal8 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt8 = parseInt(expectedVal8);
		

		cond = (expectedVal8==""+expectedValInt8+"")

		//debugger;

		if(cond)
		{
		
			enteredValue8 = parseFloat($(this).val());
			expectedVal8 = parseFloat(expectedVal8);

			if(enteredValue8>=expectedVal8){
				
				$(rowObj).find(".cell_4").html(newVal8);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue8/expectedVal8)*newVal8));
			}
		}

		else
		{
			
			if($(rowObj81).html()==50)
			{
					$(rowObj).find(".cell_4").html(newVal81);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal82);
			}

		}

	})	
	$(document).on("focus, keyup",".row9.rowTemplate input",function()
	{
		rowObj = $(this).parent().parent();
		rowObj91 = $(this).parent().parent().prev().prev().prev().find(".cell_4");
		newVal91 = 10;
		newVal92 = 0;
		expectedVal9 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal);
		$(rowObj).find(".cell_4").html("")
		newVal9 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt9 = parseInt(expectedVal9);
		

		cond = (expectedVal9==""+expectedValInt9+"")

		//debugger;

		if(cond)
		{
		
			enteredValue9 = parseFloat($(this).val());
			expectedVal9 = parseFloat(expectedVal9);

			if(enteredValue9>=expectedVal9){
				
				$(rowObj).find(".cell_4").html(newVal9);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue9/expectedVal9)*newVal9));
			}
		}

		else
		{
			
			if($(rowObj91).html()==50)
			{
					$(rowObj).find(".cell_4").html(newVal91);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal92);
			}

		}

	})		
	$(document).on("focus, keyup",".row11.rowTemplate input",function()
	{
		rowObj = $(this).parent().parent();
		rowObj111 = $(this).parent().parent().prev().find(".cell_4");
		newVal111 = 10;
		newVal112 = 0;
		expectedVal11 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal11);
		$(rowObj).find(".cell_4").html("")
		newVal11 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt11 = parseInt(expectedVal11);
		

		cond = (expectedVal11==""+expectedValInt11+"")

		//debugger;

		if(cond)
		{
		
			enteredValue11 = parseFloat($(this).val());
			expectedVal11 = parseFloat(expectedVal11);

			if(enteredValue11>=expectedVal11){
				
				$(rowObj).find(".cell_4").html(newVal11);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue11/expectedVal11)*newVal11));
			}
		}

		else
		{
			
			if($(rowObj111).html()==15)
			{
					$(rowObj).find(".cell_4").html(newVal111);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal112);
			}

		}		
	})		
			

		$(document).on("focus, keyup",".row12.rowTemplate input",function()
	{
		rowObj = $(this).parent().parent();
		rowObj121 = $(this).parent().parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().find(".cell_4");
		newVal121 = 10;
		newVal122 = 0;
		expectedVal12 = $(rowObj).find(".cell_5").html();
		// console.log(expectedVal12);
		$(rowObj).find(".cell_4").html("")
		newVal12 = parseFloat($(rowObj).find(".cell_3").html());
		expectedValInt12 = parseInt(expectedVal12);
		

		cond = (expectedVal12==""+expectedValInt12+"")

		//debugger;

		if(cond)
		{
		
			enteredValue12 = parseFloat($(this).val());
			expectedVal12 = parseFloat(expectedVal12);

			if(enteredValue12>=expectedVal12){
				
				$(rowObj).find(".cell_4").html(newVal12);
				
			}
			else{

				$(rowObj).find(".cell_4").html(Math.round((enteredValue12/expectedVal12)*newVal12));
			}
		}

		else
		{
			
			if($(rowObj121).html()==20)
			{
					$(rowObj).find(".cell_4").html(newVal121);
			}
			else
			{
					$(rowObj).find(".cell_4").html(newVal122);
			}

		}		
	})		



 $(document).on("focus, keyup",".row14.rowTemplate input",function()
 {
	rowObj = $(this).parent().parent();
	rowObj141 = $(this).parent().parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().prev().find(".cell_4");
	newVal141 = 10;
	newVal142 = 0;
	expectedVal14 = $(rowObj).find(".cell_5").html();
	console.log(expectedVal14);
	$(rowObj).find(".cell_4").html("")
	newVal14 = parseFloat($(rowObj).find(".cell_3").html());
	expectedValInt14 = parseInt(expectedVal14);


	cond = (expectedVal14==""+expectedValInt14+"")

	if(cond)
	{

		enteredValue14 = parseFloat($(this).val());
		expectedVal14 = parseFloat(expectedVal14);

		if(enteredValue14>=expectedVal14){

			$(rowObj).find(".cell_4").html(newVal14);

		}
		else{
			$(rowObj).find(".cell_4").html(Math.round((enteredValue14/expectedVal14)*newVal14));
		}
	}

	else
	{

		if($(rowObj141).html()==20)
		{
			$(rowObj).find(".cell_4").html(newVal141);
		}
		else
		{
			$(rowObj).find(".cell_4").html(newVal142);
		}

	}  
 })	

	
	$(document).on('keyup', '.txtauditorMarks',  function() {
		cal_totalScore($(".txtMaxScore").text());
	});

	$(document).on('click', '.acc-heading', function(){
	    if($(this).hasClass('accordion-active')) {
	    	$(this).removeClass('accordion-active');
	    }
	    else {
	    	$(".acc-heading").removeClass('accordion-active');
	    	$(this).addClass('accordion-active');
	    	$(".accordion-active").parent().focus();
	    }
	});
	

});
		

function cal_totalScore(total_maxScore) {





	total = 0;
	// console.log(total_maxScore)
	
		$( ".cell_4" ).each(function( index ) {
			if($(this).text() != "") {
				total += parseInt($(this).text())
			}
		});
			// alert("ff")



		

		$(".txtDealerScore").text(total);
		$("#manpower_dealerScore").val(total)
		   var percentage = ((total / total_maxScore)*100);
		   // console.log(percentage)
		   // console.log(total_maxScore)
		   //alert(total_maxScore)
		$(".txtDealerPercentage").text(percentage.toFixed(2)+ "%");
}


function manpowerSubmit(formObj,successfunction){

	if($("#txt_AMSV").val()==""){

		bootbox.alert("Enter Average Monthly Service Volume",function(){
			// $('html, body').animate({scrollTop: ($(window).scrollTop() - 180) + 'px'}, 300);
		}).on('hidden.bs.modal', function(event) {
		    $("#txt_AMSV").focus();
		});

		return false;
	}

	if($("#txt_AMPV").val()==""){

		bootbox.alert("Enter Average Monthly PDI Volume",function(){
			// $('html, body').animate({scrollTop: ($(window).scrollTop() - 180) + 'px'}, 300);
		}).on('hidden.bs.modal', function(event) {
		    $("#txt_AMPV").focus();
		});

		return false;
	}


	var arr = $('input.txtauditorMarks');
	var flag = true;
	$.each(arr, function(){
	  if($(this).val() == ""){
	  	flag = false;
	  	z = $(this).parent().parent().find(".cell_1").text()
		z = z.substr(0,z.indexOf(":("));
		obj = this;

		bootbox.alert("Enter value for "+z,function(){
			// $('html, body').animate({scrollTop: ($(window).scrollTop() - 180) + 'px'}, 300);
		}).on('hidden.bs.modal', function(event) {
		    $(obj).focus();
		});

	    return false;
	  }
	});

	if(!flag) return false;



	$("#txt_AMPV").keyup();
	$("#txt_AMSV").keyup();

	$("#txt_row1").keyup();
	$("#txt_row2").keyup();
	$("#txt_row3").keyup();
	$("#txt_row4").keyup();
	$("#txt_row5").keyup();
	$("#txt_row6").keyup();
	$("#txt_row7").keyup();
	$("#txt_row8").keyup();
	$("#txt_row9").keyup();
	$("#txt_row10").keyup();
	$("#txt_row11").keyup();
	$("#txt_row12").keyup();
	$("#txt_row13").keyup();
	$("#txt_row14").keyup();
	$("#txt_row15").keyup();



	return ajaxify('manpowerData', manpowerReturn);
}