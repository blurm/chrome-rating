const REGEX_REMOVE_BRACE = /([(（{[【〔][^((|)|{|}|【|】|〔|〕|[|\])]+[)）}\]】〕])+/g;

class JD {
    constructor() {
        // 京图图书
        this.isJD = window.location.host === 'item.jd.com' &&
            $.trim($('.breadcrumb strong a').text()) === '图书';
        // 京图热卖
        this.isRe = window.location.host === 're.jd.com' &&
            window.location.pathname.indexOf('/cps/item/') === 0;
        // 京图电子书
        this.isE = window.location.host === 'e.jd.com' &&
            $('#name h2').length > 0;
    }

    /**
     * 返回匹配的非中文字符串，如没有匹配则返回空字符串
     *
     */
    static matchEN(str) {
        const regexEN = /[^\u4e00-\u9fa5]+/g;
        let result = '';
        if (str.match(regexEN)) {
            result = str.match(regexEN).join(' ').trim();
        }
        return result;
    }

    /**
     * Return matched Chinese string, return empty string if not matched
     *
     */
    static matchCN(str) {
        const regexCN = /[\u4e00-\u9fa5]+/g;

        let result = '';
        if (str.match(regexCN)) {
            result = str.match(regexCN)[0];
        }
        return result;
    }

    static getBookShortName(bookName) {
        // Remove 第二|2版
        //const arr = name.match(/第(?:\d|[\u4e00-\u9fa5])版/);
        const tmpBookName = bookName.replace(
                                /\s*第(?:\d|[\u4e00-\u9fa5])版\s*/, '');
        let shortName = [tmpBookName];
        if (tmpBookName.match(/:|：|\s/)) {
            const arr = tmpBookName.split(/:|：|\s/);
            shortName = arr;
        }
        return shortName;
    }

    static formatBookname(name, publisher) {
        // 将版本字符串先提取出来，最后再拼接到书名后面
        const arr = name.match(/第(?:\d|[\u4e00-\u9fa5])版/);
        let edition = '';
        if (arr) {
            edition = arr[0];
        }

        const tempName = name
            // 去掉【】[] () {} 及其包含的内容
            .replace(REGEX_REMOVE_BRACE, ' ')
            // 去掉以作品集，系列，纪念版等结尾的字段
            .replace(/\S+(作品集|纪念版|作品|著作|丛书|新版)\d*(:|：)?/g, '')
            // 替换某些特殊字符，比如‘/’
            .replace(/\/|:|：|·|\./g, ' ').trim();

        let result = tempName;

        // 如果是英文原版书籍，只取英文部分作为标题
        // 部分电子书出版商是空
        if (publisher !== '' && JD.matchCN(publisher) === '') {
            result = JD.matchEN(tempName);
            //if (JD.matchEN(tempName) !== '') {
                //result += ' ' + JD.matchEN(tempName);
            //}
        }

        if (edition !== '') {
            result += ' ' + edition;
        }
        return result;
    }

    static formatAuthor(author) {
        const authorStr = author.replace(REGEX_REMOVE_BRACE, '');
        const regex = /[^(\s|《|》|(|)|（|）|,|，)]+/;
        return authorStr === ''?authorStr:authorStr.match(regex);
    }

    static createOptions($target, $link) {
        const nameStr =
            $.trim(
                function(){
                    const $selectedTab =
                        $target.find('.tab-cnt-i-selected');
                    if ($selectedTab.length > 0) {
                        return $selectedTab.find('.p-name a em').text();
                    }
                    return $target.find('.p-name a em').text();
                }()
            ) ||
            // sale.jd.com list page
            $.trim($target.find('.jDesc a').text()) ||
            $.trim($link.attr('title')) ||
            $.trim($link.find('img').attr('alt')) ||
            $.trim($link.find('img').attr('title')) ||
            $.trim($link.find('.title').text()) ||
            $.trim($link.find('.info h2').text()) ||
            $.trim($target.find('.p_bt a').text()) ||
            $.trim($target.find('.title a').text()) ||
            $.trim($target.find('dt.p-name a').text()) ||
            $.trim($target.find('dd a').text()) ||
            $.trim($link.text());

        let authorArr = [];

        if ($target.find("a[href*='writer']").length > 0) {
            authorArr = $target.find("a[href*='writer']");
        } else if ($target.find("a[href*='author']").length > 0) {
            authorArr = $target.find("a[href*='author']");
        } else {
            authorArr = $target.find('.p-infoo').eq(0).find('a');
        }

        let authorStr = '';
        for (const author of authorArr) {
            authorStr += $.trim(JD.formatAuthor(author.innerText)) + ' ';
        }
        authorStr = $.trim(authorStr);

        const publisher =
            $.trim($target.find('.p-bookdetails .p-bi-store a:first').text()) ||
            $.trim($target.find("a[href*='publish']").text()) ||
            $.trim(
                $target.find('.p-infoo').eq(1) ?$target.find('.p-infoo').eq(1).find('a').text():''
            ) || '';

        const bookName = JD.formatBookname(nameStr, publisher);
        const options = {
            name: bookName,
            shortName: JD.getBookShortName(bookName),
            author: authorStr,
            type: "book"
        };

        return options;
    }

    main() {
        //debugger;
        console.log('JD.js');
        if (this.isJD) {
            //new DoubanX({
                //name: $('#name h1').text(),
                //type: 'book'
            //}).getRate();
        }

        if (this.isRe) {
            //new DoubanX({
                //name: $('.shop_intro h2 a').text(),
                //type: 'book'
            //}).getRate();
        }

        if (this.isE) {
            //new DoubanX({
                //name: $('#name h2').text(),
                //type: 'book'
            //}).getRate();
        }

        const doubanInfo = new DoubanInfo();
        const common = new Common(doubanInfo, JD.createOptions);
        /**
         * 为list页面当前激活的item生成评分信息
         *
         * list.jd.com
         *      .m-list .j-sku-item, list.jd.com 包括多tab的item
         * search.jd.com
         *      .m-list .tab-cnt-i-selected, 多tab item
         *      .m-list .gl-i-wrap, 普通item
         */
        common.listHandle(
            /^\/\/(item|e)\.jd\.com\/\d*\.html/i,
            '.m-list .j-sku-item, \
            .m-list .tab-cnt-i-selected, \
            .m-list .gl-i-wrap, \
            .mc li, \
            .ui-switchable-panel li, \
            .book-product li, \
            .book-items li, \
            .tabcon li, \
            .tabcon .item, \
            .may-like-list li, \
            .recent-view-list li'
        );
    }
}

new JD().main();
