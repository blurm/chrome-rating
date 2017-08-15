class Ttmeiju {
    static createOptions($target) {
        let nameStr = $.trim($target.text());
        nameStr = Test.matchEN(nameStr)
        const options = {
            name: nameStr,
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
console.log('ttmeiju.js');
new Ttmeiju().main();
