class Ttmeiju {
    static createOptions($target) {
        let nameStr = $.trim($target.find('a[href^="/seed/"]').text());
        nameStr = Util.matchEN(nameStr);
        const options = {
            name: nameStr,
            type: "movie"
        };

        return options;
    }

    main() {
        Common.listHandle(
            /\/seed\/\d+\.html/i,
            'tr',
            Ttmeiju.createOptions
        );
    }
}
console.log('ttmeiju.js');
new Ttmeiju().main();
