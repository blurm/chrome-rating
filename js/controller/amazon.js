// 全局变量，用来存储当前触发评分信息显示的元素
var $target = null;
// 是否有其他mouseenter事件改变了$target, 如果已经改变就设置为true
// 之前已经在运行的mouseenter事件需要停止。
var rating4U_stop = false;
// 需要被停止的书目
var rating4U_stop_title = '';

class Amazon {

    /**
     * 根据返回的商品详情页面判断是否是图书
     * 如果是就再发起异步请求，取得评分信息
     *
     * @param data 返回的详情页面html
     *
     */
    listHandle(data) {
        console.log('book data returned');
        //console.log('listHandle rating4U_stop', rating4U_stop, $target.text());
        // 如果发起请求后鼠标移出元素范围，则取消请求
        if (!$target.is(':hover')) {
            rating4U_stop = false;
            $target = null;
            return;
        }

        // convert html response to jquery object for fetch element easily
        var $dom = $($.parseHTML(data));

        const regIsBook = /class='nav-a nav-b'><span class="nav-a-content">图书<\/span>/i;
        // 从详情页面判断如果是图书，或者是kindle电子书的话
        if (regIsBook.test(data) || /Kindle/.test($dom.find('#title').text())) {
            // Selects the combined results of all the specified selectors.
            const nameStr = $dom.find('#productTitle, #ebooksProductTitle').text();
            const authorStr = $dom.find('.author a').map((index, ele) => {
                                    return Util.formatAuthor($(ele).text());
                                }).get().join(' ');
            const publisher = $dom.find('#detail_bullets_id .content li').eq(0).text();
            const bookName = Util.formatBookname(nameStr, publisher);

            if (rating4U_stop) {
                for (const str of bookName.split(' ')) {
                    console.log('str bookname: ', str, rating4U_stop_title);
                    if (rating4U_stop_title.indexOf(str) >= 0) {
                        console.log('bookName: ', bookName);
                        console.log('rating4U_stop_title: ', rating4U_stop_title);
                        // 如果有其他的评分信息请求同时发起（鼠标触发第一个请求之后迅速移动到
                        // 其他书目，发起第二个请求），则当前请求取消返回。
                        rating4U_stop = false;
                        console.log('correct book and stopped', bookName);
                        return;
                    }
                }
            }
            const options = {
                name: bookName,
                shortName: Util.getBookShortName(bookName),
                author: authorStr,
                type: "book"
            };

            const modules = [new DoubanInfo()];
            const common = new Common(modules, null, 'book', options);
            common.showTips($target, null, options);
        }

        // 清空全局target变量
        console.log('listHandle Finished, target was set to null', $target.text());
        $target = null;
    }

    main() {
        const reg = /.*/i;
        const tag = '.s-access-detail-page, \
                    .a-text-center, \
                    .a-col-left, \
                    .ch-tabwidget-asintitle, \
                    .ch-tabwidget-pc-contentAsinImgBody, \
                    .acs_product-image, \
                    .acs_product-title';
        $('body').on('mouseenter', tag, (ev) => {
            setTimeout(() => {
                // 当前触发事件的对象主题
                console.log('target on start, last:', $target === null ? $target :$target.text());
                if ($target) {
                    rating4U_stop = true;
                    rating4U_stop_title = $target.text();
                    console.log('rating4U_stop was set to true, stop ->:', rating4U_stop_title);
                }
                $target = $(ev.currentTarget);

                console.log('current target: ', $target.text());

                const $targetA = $target.find('a').eq(0);
                const $link = $targetA.length !== 0 ? $targetA : $target;
                let href = $.trim($link.attr('href'));

                if (reg.test(href)) {
                        if ($target.is(':hover')) {
                            console.log('hover:', $target.text());
                            new Promise(
                                (success, error) => {
                                    $.get(href, success);
                               })
                                .then(this.listHandle);
                        }
                }
            }, 1000);
        });

        $('body').on('mouseleave', tag, {tag: tag, reg: reg, type: 'book'}, Common.mouseLeave);
    }
}
new Amazon().main();
