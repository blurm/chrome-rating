class Youku {
    constructor() {
        this.reg = {
        };
    }

    static createOptions($target, $link) {
        const nameStr = $.trim($target.find('li.title').text()) ||
            $.trim($target.find('.v-meta-title').text()) ||
            $.trim($target.find('.p-meta-title').text());

        //const bookName = JD.formatBookname(nameStr, publisher);
        const options = {
            name: nameStr,
            type: "movie"
        };

        return options;
    }

    main() {
        const modules = [new DoubanInfo(), new IMDBInfo()];
        const common = new Common(modules, Youku.createOptions, 'movie');
        common.listHandle(
            //v.youku.com/v_show/id_XMjcwNDg0NDI3Mg==.html?spm=a2h1n.8251845.0.0
            /\/\/v\.youku\.com\/v_show\/id_.*/i,
            '.box-series .pack-film, \
            .yk-body .ishover, \
            .piclist-scroll-pic li'
        );
    }
}
console.log('iqiyi.js');
new Youku().main();
