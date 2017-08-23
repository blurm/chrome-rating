class Ttmeiju {
    static createOptions($target) {
        let nameStr = $.trim($target.text());

        // 在调用公共parse之前先去除ttmeiju相关格式
        // 去掉所有的汉字信息，字幕组信息
        nameStr = nameStr.replace(/\./g, ' ')
            .replace(/\S*[\u4e00-\u9fa5]+\S*/g, '');
        // 针对国内某字幕组自定义的名字Short
        nameStr = nameStr.replace(/Short\s*(?=[0-9]{3,4}[pP][^M])/, '');
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

console.log('ttmeiju');
new Ttmeiju().main();
