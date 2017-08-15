$(document).ready(function(){
    $("#one").click(function(){
        console.log("p toggle");
        $("p").toggle("slow");
    });
    $("#two").click(function(){
        $("p").show();
    });
});

function Human(name, age) {
    this.name = name;
    this.age = age;
}
Human.prototype.run = function() {
    console.log(this.name + " is running");
};
Human.prototype.greeting = function() {
    console.log(this.name + " saying \"Hello\"");
};

var man1 = new Human("Damon", 34);
man1.run();
man1.greeting();

console.log("changing profile");

man1.name = "Cassy";

man1.greeting();
console.log(man1.constructor.name);

function Student(name, age, grade) {
    Human.call(this, name, age);
    this.grade = grade;
}

Student.prototype = Object.create(Human.prototype);
Student.prototype.constructor = Student;

Student.prototype.doWork = function() {
    console.log(this.name + " doing homework");
};
var stu1 = new Student("stu1", 33, 1);
console.log(stu1.run());
console.log(stu1.doWork());

var params = {
    "name": "damon",
    "age": 34
};

var text = $.param(params);
console.log(text);

console.log('------------- regex ---------------');

/**
 * 返回匹配的非中文字符串，如没有匹配则返回空字符串
 *
 */
    function matchEN(str) {
        const regexCN = /[^\u4e00-\u9fa5]+/;
        console.log('matchEN', str.match(regexCN));
        return str.match(regexCN) !== null ? str.match(regexCN)[0] : '';
    }
var ss = 'sfasd an fasdf速度发放';
console.log(ss);
matchEN(ss);

function matchCN(str) {
    const regexCN = /[\u4e00-\u9fa5]+/;

    let result = '';
    if (str.match(regexCN)) {
        result = str.match(regexCN)[0];
    }
    return result;
}


function formatBookname(name) {
    const publisher = 'sdfasf';
    const regex = /(.+[:|：]\s*)?《?([^(:|：【|】|《|》|(|)|（|）)]+)/;
    const tempName = name.match(regex)[2];
    console.log('temp book name:', tempName);

    let result = '';
    // 判断出版社是否是英文，如果是则是原版书
    if (matchCN(publisher) === '') {
        result = matchEN(tempName);
    } else {
        result = matchCN(tempName);
    }
    console.log('book name:', result);
    return result !== ''?result:tempName;
}

var ex1 = '肯·福莱特世纪三部曲：《巨人的陨落》';
var ex2 = '东野圭吾：大雪中的山庄';
var ex3 = '单恋（2016版）';
var ex4 = '1984（最新经典权威译本 盒装本 赠英文版）';
var ex5 = '心理学入门 : 改变一生的66堂心理课';
var ex6 = '中国科幻基石丛书·三体（3）：死神永生';
var ex7 = 'Unbroken坚不可摧 英文原版';

const regex = /(^\S+[:|：]\s*)?《?([^(:|：【|】|《|》|(|)|（|）)]+)/;
console.log(formatBookname(ex1));
console.log(formatBookname(ex2));
console.log(formatBookname(ex3));
console.log(formatBookname(ex4));
console.log(formatBookname(ex6));
console.log(formatBookname(ex7));
console.log(formatBookname(ex5));


function test(f1, f2) {
    var timeOut = Math.random() * 2;
    //console.log('set timeout to: ' + timeOut + ' seconds.');
    setTimeout(function () {
        if (timeOut < 1) {
            //console.log('call f1()...');
            f1('200 OK');
        }
        //else {
            //console.log('call f2()...');
            //f2('timeout in ' + timeOut + ' seconds.');
        //}
    }, timeOut * 1000);
}

var p1 = new Promise(test);
var p2 = p1.then(function (result) {
    //console.log('成功：' + result);
});
var p3 = p2.catch(function (reason) {
    //console.log('失败：' + reason);
});

console.log('----------- author name ----------------');
var au1 = '[美] Justin Seitz（贾斯汀·塞茨）';
var au2 = '华校专，王正林';
var au3 = '[美] 萨默菲尔德（Mark Summerfield）';
var au4 = '[美] Warren Sande，Carter Sande';
var au5 = '[美] Allen B.Downey';
var au6 = "[美] TJ O'Connor（TJ 奥科罗）";
var au7 = 'Gunter Mader ， Elke Zimmerman';

function isMatchAuthor(curAuthor, jsonAuthor) {
    const nameArr = curAuthor.replace(/[．|.|,|，]/, ' ').split(/\s/);
    for (const authorJ of jsonAuthor) {
        let isMatched = false;
        for (const namePart of nameArr) {
            if (authorJ.match(namePart)) {
                isMatched = true;
                break;
            }
        }
        if (isMatched) {
            return true;
        }
    }
    return false;
}

const jsonAuthor = ["Christie, Agatha", "Fredricks, Karen S.", "Richard H. Brown", "Paul E. Cohen", "理察.迪威特(Richard DeWitt)"];
const curAuthor = "Christie";

console.log(isMatchAuthor(curAuthor, jsonAuthor));

var arr = $('#test a');
for (const a of arr) {
    console.log(a);
}

console.log(arr);
