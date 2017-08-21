class Ttmeiju {
    static createOptions($target) {
        let nameStr = $.trim($target.text());
        const nameYear = TitleParser.parse(nameStr)
        const options = {
            name: nameYear.name,
            year: nameYear.year,
            type: "movie"
        };

        return options;
    }

    main() {
        const common = new Common(
        [new DoubanInfo(), new IMDBInfo()], Ttmeiju.createOptions, 'movie');
        common.listHandle(
            /\/seed\/\d+\.html/i,
            'td a'
        );
    }
}

new Ttmeiju().main();
