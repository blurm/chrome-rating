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

    const arr = ['aa', 'aad', 'f', 'asdfas', 'sdf'];
    arr.sort((a,b) => {
        if (a.length > b.length) {
            return 1;
        } else if (a.length < b.length) {
            return -1;
        }
        return 0;
    });
    console.log(arr);
});

