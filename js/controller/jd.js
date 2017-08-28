class JD {
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
            authorStr += $.trim(Util.formatAuthor(author.innerText)) + ' ';
        }
        authorStr = $.trim(authorStr);

        const publisher =
            $.trim($target.find('.p-bookdetails .p-bi-store a:first').text()) ||
            $.trim($target.find("a[href*='publish']").text()) ||
            $.trim(
                $target.find('.p-infoo').eq(1) ?$target.find('.p-infoo').eq(1).find('a').text():''
            ) || '';

        const bookName = Util.formatBookname(nameStr, publisher);
        const options = {
            name: bookName,
            shortName: Util.getBookShortName(bookName),
            author: authorStr,
            type: "book"
        };

        return options;
    }

    main() {
        const modules = [new DoubanInfo()];
        const common = new Common(modules, JD.createOptions, 'book');
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
