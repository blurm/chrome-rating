class Rarbg {
    constructor() {
        this.reg = {
        };
    }

    static createOptions($target, $link) {
        const nameStr = $.trim($target.find('a').text()) ||
                           $('body #overlib').text();

        const nameYear = TitleParser.parse(nameStr)
        const options = {
            name: nameYear.name,
            year: nameYear.year,
            type: "movie"
        };

        return options;
    }

    main() {
        const modules = [new DoubanInfo(), new IMDBInfo()];
        const common = new Common(modules, Rarbg.createOptions, 'movie');
        common.listHandle(
            /(^https:\/\/rarbg\.is)?\/torrent\/.*/i,
            'td.lista'
        );
    }
}
console.log('rarbg.js');
new Rarbg().main();
