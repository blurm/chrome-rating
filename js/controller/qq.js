class QQ {
    constructor() {
        this.isFilm = window.location.host === 'film.qq.com';
        this.isVideo = window.location.host === 'v.qq.com';
        this.page = {
            video: $('#mod_player').length > 0,     // 播放页
            tv: ($('#mod_player').length > 0) &&
            ($('.album_list li').length > 0),   // 电视剧
            movie: ($('#mod_player').length > 0) &&
            ($('.album_list li').length === 0)  // 电影
        };
        this.reg = {
            isFilm: /(^http:\/\/film\.qq\.com)*\/cover\/.*\.html/i,
            isVideo: /^http:\/\/v\.qq\.com\/(cover|prev)\/.*\.html/i
        };
    }

    static createOptions($target, $link) {
        const nameStr = $.trim($target.find('.figure_title a').text()) ||
                        $.trim($target.find('a .title_inner').text());

        //const bookName = JD.formatBookname(nameStr, publisher);
        const options = {
            name: nameStr,
            type: "movie"
        };

        return options;
    }

    main() {
        if (this.isFilm && this.page.movie) {
            //new DoubanX({
                //name: $('.player_title').text(),
                //type: 'movie'
            //}).getRate();
        }

        if (this.isFilm && this.page.tv) {
            //new DoubanX({
                //name: $('.album_title').text(),
                //type: 'movie'
            //}).getRate();
        }

        if (this.isVideo && this.page.tv) {
            //new DoubanX({
                //name: $('.intro_title .title_inner').text(),
                //type: 'movie'
            //}).getRate();
        }

        if (this.isVideo && this.page.movie) {
            //new DoubanX({
                //name: $('#h1_title').text(),
                //type: 'movie'
            //}).getRate();
        }

        const modules = [new DoubanInfo(), new IMDBInfo()];
        const common = new Common(modules, QQ.createOptions, 'movie');
        common.listHandle(
            /(^http:\/\/(film|v)\.qq\.com)*\/(x\/)?(cover|prev)\/.*\.html/i,
            'li, \
            .top_list .title_inner'
        );
    }
}
console.log('qq.js');
new QQ().main();
