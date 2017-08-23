class Iqiyi {
    constructor() {
        this.reg = {
        };
    }

    static createOptions($target, $link) {
        const nameStr = $.trim($target.find('.site-piclist_info_title a').text()) ||
            $.trim($target.find('.result_title a').text());

        //const bookName = JD.formatBookname(nameStr, publisher);
        const options = {
            name: nameStr,
            type: "movie"
        };

        return options;
    }

    main() {
        const modules = [new DoubanInfo(), new IMDBInfo()];
        const common = new Common(modules, Iqiyi.createOptions, 'movie');
        common.listHandle(
            /(^http:\/\/www\.iqiyi\.com)?\/(([a|v]_)|(lib\/)).*/i,
            '.wrapper-piclist li, \
            .mod_result .result_info, \
            .piclist-scroll-pic li'
        );
    }
}
console.log('iqiyi.js');
new Iqiyi().main();
