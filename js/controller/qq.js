class QQ {
    static createOptions($target, $link) {
        const nameStr = $.trim($target.find('.figure_title a').text()) ||
                        $.trim($target.find('.result_title em').text()) ||
                        $.trim($target.find('a .title_inner').text());

        //const bookName = JD.formatBookname(nameStr, publisher);
        const options = {
            name: nameStr,
            type: "movie"
        };

        return options;
    }

    main() {
        const modules = [new DoubanInfo(), new IMDBInfo()];
        const common = new Common(modules, QQ.createOptions, 'movie');
        common.listHandle(
            /(^http:\/\/(film|v)\.qq\.com)*\/(((x\/)?(cover|prev))|detail)\/.*\.html/i,
            '.result_item_v ._infos, \
            li.list_item, \
            .top_list .title_inner'
        );
    }
}
console.log('qq.js');
new QQ().main();
