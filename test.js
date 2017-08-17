$(document).ready(function(){
    $("#one").click(function(){
        $('.wrapper').toggleClass('animated fadeIn');
        //console.log("p toggle");
        //$("p").toggle("slow");
    });
    $("#two").click(function(){
        $('.wrapper').fadeIn();
        $("p").show();
    });
});

