class BaseInfo {
    constructor(options) {
        this.name = options.name || '';     // 名称
        this.type = options.type || '';     // 类型 movie/book
        this.year = options.year || '';     // 年代 用来过滤电影
        this.url = options.url || '';
    }

    get(success, fail) {
        $.getJSON(this.url, this.getParams(), success).fail(fail);
    }

    getSync(url) {
        return $.ajax({
            url: url,
            async: false
        }).responseJSON;
    }

    getParams() {}

    static rmComma(str) {
        if (str.length > 0 && str[str.length-1] == '，') {
            return str.substring(0, str.length-2);
        }
    }
}

// ---------------------------------------------------------------------------
/*
var options = {
    name : "Alien Covenant",
    type : "movie",
    year : 2017,
    url : "https://api.douban.com/v2/movie/search"
};
var doubanInfo = new DoubanInfo(options);
doubanInfo.get(function(json) {
    console.log(json);
});
doubanInfo.getRatingInfo();

var optionsImdb = {
    name : "Alien Covenant",
    type : "movie",
    year : 2017,
    url : "https://www.theimdbapi.org/api/find/movie"
};
var imdbInfo = new IMDBInfo(optionsImdb);
imdbInfo.get((json) => {
    console.log(json);
});
console.log('----- getRatingInfo for IMDB---------');
console.log(imdbInfo.getRatingInfo());

var optionsBook = {
    name : "我爱比尔",
    type : "book"
};
var doubanBookInfo = new DoubanInfo(optionsBook);
console.log('---- getRatingInfo for Douban book -----');
console.log(doubanBookInfo.getRatingInfo());
*/
