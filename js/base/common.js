class Common {
    constructor(modules, createOptions, type, options) {
        this.modules = modules;
        this.createOptions = createOptions;
        this.type = type;
        // for amazon
        this.options = options;
    }

    showTips($target, $link, options) {
        var that = this;

        const module = that.modules[0];
        // amazon图书会传options进来
        if (options) {
            module.options = options;
        } else {
            module.options = that.createOptions($target, $link);
        }

        const type = this.type;
        new Template(null, type).showTips($target, 'loading');

        function baseResolve(result, module, isIMDBRating) {
            const data = module.popData(result);

            // 如果只更新imdb评分div
            if (isIMDBRating) {
                if (data.errMsg && data.errMsg !== '') {
                    // 显示错误信息div
                    new Template(data, type).showIMDBError();
                } else {
                    new Template(data, type).showIMDBRating();
                }
            } else if (data.errMsg && data.errMsg !== '') {
                // 显示错误信息div
                new Template(data, type).showTips($target, 'error');
            } else {
                // 显示正常信息div
                new Template(data, type).showTips($target, type);
            }

            return data;
        }

        function imdbResolve(result) {
            baseResolve(result, that.modules[1], true);
        }

        function imdbReject(reason) {
            console.log('失败：', reason);
            const data =that.modules[1].popError(reason);
            new Template(data, type).showIMDBError();
        }

        function mainResolve(result) {
            const data = baseResolve(result, that.modules[0], false);

            // for amazon book
            if (typeof rating4U_stop !== 'undefined' && rating4U_stop && rating4U_stop_title.indexOf(data.title) >= 0) {
                console.log('mainResolve stop:', rating4U_stop);
                return;
            }

            // 如果是海外发行的电影，就去IMDB取评分
            if (that.modules[1] && data.enName !== '') {
                const imdbModule = that.modules[1];
                imdbModule.options = {
                    name: data.enName,
                    year:data.year,
                    type:that.type
                };

                new Promise((success, error) => imdbModule.getRatingInfo(
                                                            success, error))
                    .then(imdbResolve)
                    .catch(imdbReject);
            }

            // for amazon book
            if (typeof rating4U_stop !== 'undefined') {
                console.log('resloved, rating4U_stop false', data.title);
                rating4U_stop = false;
            }
        }

        function mainReject(reason) {
            // for amazon book
            if (typeof rating4U_stop !== 'undefined' && rating4U_stop) {
                console.log('mainReject stop:', rating4U_stop);
                rating4U_stop = false;
                return;
            }

            console.log('失败：', reason);
            const data =module.popError(reason);
            new Template(data, type).showTips($target, 'error');

            // for amazon book
            if (typeof rating4U_stop !== 'undefined') {
                console.log('rejected, rating4U_stop false');
                rating4U_stop = false;
            }
        }

        new Promise(
                (success, error) => module.getRatingInfo(success, error))
                .then(mainResolve)
                .catch(mainReject);
    }

    /**
     * 处理list列表中的mouse hover over事件
     *
     * reg: regex for url address. 只针对有效的item进行处理, 用来过滤触发的元素
     * tag: selecor to match all list style 在这些元素上触发评分信息提示
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
                //$target.data('allow', true);
                //$target.data('movein', false);
                setTimeout(() => {
                    if ($target.is(':hover')) {
                        this.showTips($target, $link);
                    }
                }, 1000);
            }
        });

        //$('body').on('mouseleave', tag, {tag: tag, reg: reg, type: that.type}, Common.mouseLeave);
    }

    static mouseLeave(ev) {
        const reg = ev.data.reg;
        const tag = ev.data.tag;
        const $target = $(ev.currentTarget);
        const a = $target.find('a').eq(0);
        const $link = a.eq(0).length !== 0 ? a.eq(0) : $target;
        const href = $.trim($link.attr('href'));

        if (reg.test(href)) {
            let $tip = '';
            if (ev.data.type === 'book') {
                $tip = $('.book-douban');
            } else {
                $tip = $('#rating4U_movie');
            }

            $tip.on('mouseleave', () => {
                $tip.fadeOut(DUR_FO_TIP);
                setTimeout(() => {
                    $tip.remove();
                }, DUR_FO_TIP);
            });

            setTimeout(function () {
                if (!$tip.is(':hover')) {
                    $tip.fadeOut(100);
                    setTimeout(() => {
                        $tip.remove();
                    }, DUR_FO_TIP);
                }
            }, DUR_FO_TIP);
        }
    }
}

jQuery.fn.mouseIsOver = function () {
    return $(this).parent().find($(this).selector + ":hover").length > 0;
};
