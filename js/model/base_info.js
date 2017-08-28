class BaseInfo {

    set options(options) {
        this.name = options.name || '';     // 名称
        this.type = options.type || '';     // 类型 movie/book
        this.year = options.year || '';     // 年代 用来过滤电影
        this.url = options.url || '';
    }

    get(success, fail) {
        if (TEST_MODE) {
            success();
            return;
        }
        $.getJSON(this.url, this.getParams(), success).fail(fail);
    }

    getSync(url) {
        return $.ajax({
            url: url,
            async: false
        }).responseJSON;
    }

    getSyncHTML(url) {
        return $.ajax({
            url: url,
            async: false
        }).responseText;
    }

    getParams() {}

    /**
     * 移除最后一个逗号
     *
     */
    static rmComma(str) {
        if (str.length > 0 && str[str.length-1] == '，') {
            return str.substring(0, str.length-1);
        }
        return str;
    }

    /**
     * 根据评分数字来计算星星的数量
     * 目前计算的和douban并不一致，只是大概看下
     *
     */
    countStar(rating) {
        const rateNum = Math.round(rating * 10 / 2);
        let units = rateNum % 10;
        let tens = rateNum - units;
        if (units >= 5) {
            units = 0;
            tens += 10;
        } else {
            units = 5;
        }

        return tens + units;
    }

}
