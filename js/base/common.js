class Common {
    constructor(infoModule, createOptions) {
        this.infoModule = infoModule;
        this.createOptions = createOptions;
    }

    /**
     * 处理list列表中的mouse hover over事件
     *
     * reg: regex for url address. 只针对有效的item进行处理
     * tag: selecor to match all list style, which allow to trigger Info
     * type: book/movie
     */
    listHandle(reg, tag) {
        var that = this;
        // ev - eventObject
        $('body').on('mouseenter', tag, (ev) => {
            // 当前触发事件的对象主题
            const $target = $(ev.currentTarget);
            // find() 如果一个jQuery对象表示一个DOM元素的集合， .find()方法允许
            // 我们能够通过查找DOM树中的这些元素的后代元素
            // eq()方法从集合的一个元素中构造新的jQuery对象。所提供的索引标识这
            // 个集合中的元素的位置。
            const $targetA = $target.find('a').eq(0);
            const $link = $targetA.length !== 0 ? $targetA : $target;
            const href = $.trim($link.attr('href'));

            if (reg.test(href)) {
                //data() 方法允许我们在DOM元素上绑定任意类型的数据,避免了循环引用的内存泄漏风险。
                // allow: 允许发起ajax请求并显示结果
                $target.data('allow', true);
                $target.data('movein', false);
                setTimeout(() => {
                    if ($target.data('allow')) {
                        $target.data('allow', false);
                        $target.data('loading', true);

                        that.infoModule.options = that.createOptions(
                                                            $target, $link);

                        const type = that.infoModule.type;
                        new Template().showTips($target, 'loading');

                        new Promise((success, error) =>
                            that.infoModule.getRatingInfo(success, error))
                                .then(function (result) {
                            const data = that.infoModule.popData(result);
                            $target.data('allow', true);
                            $target.data('loading', false);
                            if (!$target.data('movein')) {
                                if (data.errMsg && data.errMsg !== '') {
                                    new Template(data)
                                        .showTips($target, 'error');
                                } else {
                                    new Template(data, type)
                                        .showTips($target, type);
                                }
                            }
                        }).catch(function (reason) {
                            console.log('失败：', reason);
                            const data =that.infoModule
                                .popError(reason.responseJSON);
                            $target.data('allow', true);
                            $target.data('loading', false);
                            if (!$target.data('movein')) {
                                new Template(data).showTips($target, 'error');
                            }
                        });
                    }
                }, 300);
            }
        });

        $('body').on('mouseleave', tag, (ev) => {
            const $target = $(ev.currentTarget);
            const a = $target.find('a');
            const $link = a.eq(0).length !== 0 ? a.eq(0) : $target;
            const href = $.trim($link.attr('href'));

            if (reg.test(href)) {
                const tip = $('#doubanx-subject-tip');

                tip.on('mouseleave', () => {
                    tip.remove();
                });

                setTimeout(function () {
                    if (!tip.is(':hover')) {
                        tip.remove();
                    }
                }, 500);

                $target.data('allow', false);
                $target.data('movein', true);
            }
        });
    }
}
