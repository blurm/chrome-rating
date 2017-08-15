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
        const imdbInfo = new IMDBInfo();
        const common = new Common(imdbInfo, Ttmeiju.createOptions);
        common.listHandle(
            /\/seed\/\d+\.html/i,
            'td a'
        );
    }
}

new Ttmeiju().main();
