$(document).ready(function(){
    $("#one").click(function(){
        $('.wrapper').toggleClass('animated fadeIn');
        //console.log("p toggle");
        //$("p").toggle("slow");
        const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13];
        const max = 18;
        const resultArr = [];
        while (arr.length > 0) {
            const indexArr = [];
            const subResultArr = [];
            indexArr.push(arr.length-1);
            subResultArr.push(arr[arr.length-1]);
            let temp = arr[arr.length-1];
            for (let i = arr.length-2; i >= 0; i--) {
                if (temp + arr[i] < max) {
                    temp += arr[i];
                    indexArr.push(i);
                    subResultArr.push(arr[i]);
                }

            }

            for (let i = 0, len = indexArr.length; i < len; i++) {
                arr.splice(indexArr[i], 1);
            }
            resultArr.push(subResultArr);
        }
        //console.log(resultArr);

        const tt = [];
        tt.push(1);
        tt.push(2);
        console.log(tt);
    });
    $("#two").click(function(){
        $('.wrapper').fadeIn();
        $("p").show();
    });

});

