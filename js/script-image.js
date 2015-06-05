var abc = 0; //Declaring and defining global increement variable
// function callBackFile(){
//     if(abc==0){
//         alert('hi');
//         $('#upload_section').append(
//             $("<input/>", {name: 'file[]', type: 'file', id: 'file',class:'upload_wrap'})
//         ));
//     }
// }
$(document).ready(function() {
$('.button_wrap').click(function(){
    $('.upload_wrap').click();
});
      

//To add new input file field dynamically, on click of "Add More Files" button below function will be executed
    $('#add_more').click(function() {
        $(this).before($("<div/>", {class: 'filediv'}).fadeIn('slow').append(
            $("<input/>", {name: 'file[]', type: 'file', id: 'file',class:'upload_wrap'})
        ));
    });

//following function will executes on change event of file input to select different file	
$('body').on('change', '#file', function(){
            if (this.files && this.files[0]) {
                 abc += 1; //increementing global variable by 1

                 if(abc<=5){  
                    $('.add_more').show();              
                    var z = abc - 1;
                    var x = $(this).parent().find('#previewimg' + z).remove();
                    $(this).before("<div id='abcd"+ abc +"' class='abcd'><img id='previewimg" + abc + "' src=''/></div>");
                   
                    var reader = new FileReader();
                    reader.onload = imageIsLoaded;
                    reader.readAsDataURL(this.files[0]);
                   
                    $(this).hide();
                    $("#abcd"+ abc).append($("<img/>", {class: 'close_img', src: 'x.png', alt: 'delete'}).click(function() {
                        $(this).parent().parent().remove();
                        abc-=1;
                        
                    }));

                    if(abc==5){
                        $('.add_more').hide(); 
                    }
                 } else alert("You have uploaded 5 images\n Sorry!!")
            }
        });
// function callBackFile(){
//     alert('hi');
//     $('#upload_section').fadeIn('slow').append(
//             $("<input/>", {name: 'file[]', type: 'file', id: 'file',class:'upload_wrap'})
//         ));
//     return false;
// }
//To preview image     
    function imageIsLoaded(e) {
        $('#previewimg' + abc).attr('src', e.target.result);
    };

    $('#upload').click(function(e) {
        var name = $(":file").val();
        if (!name)
        {
            alert("First Image Must Be Selected");
            e.preventDefault();
        }
    });
});