class Common {
    constructor(modules, createOptions, type) {
        this.modules = modules;
        this.createOptions = createOptions;
        this.type = type;
    }

    showTips($target, $link) {
        var that = this;

        const module = that.modules[0];
        module.options = that.createOptions($target, $link);
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
        }

        function mainReject(reason) {
            console.log('失败：', reason);
            const data =module.popError(reason);
            new Template(data, type).showTips($target, 'error');
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
                    //if ($target.data('allow')) {
                        //$target.data('allow', false);
                        //$target.data('loading', true);
                if ($target.is(':hover')) {
                    this.showTips($target, $link);

                        //for (let i = 0; i < that.modules.length; i++) {
                            //// 显示的主要内容源
                            //if (i === 0) {
                                //const module = that.modules[i];
                                //module.options = that.createOptions($target, $link);
                                //const type = module.type;
                                //new Template(null, type).showTips($target, 'loading');

                                //new Promise((success, error) =>
                                    //module.getRatingInfo(success, error))
                                        //.then(function (result) {
                                            //const data = module.popData(result);
                                            ////$target.data('allow', true);
                                            ////$target.data('loading', false);
                                            ////if (!$target.data('movein')) {
                                                //if (data.errMsg && data.errMsg !== '') {
                                                    //new Template(data, type)
                                                        //.showTips($target, 'error');
                                                //} else {
                                                    //new Template(data, type)
                                                        //.showTips($target, type);
                                                //}
                                            ////}
                                        //}).catch(function (reason) {
                                            //console.log('失败：', reason);
                                            //const data =module
                                                //.popError(reason.responseJSON);
                                            ////$target.data('allow', true);
                                            ////$target.data('loading', false);
                                            //if (!$target.data('movein')) {
                                                //new Template(data, type).showTips($target, 'error');
                                            //}
                                        //});

                            //} else {
                                //// 显示的其他评分源

                            //}

                        //}
                    //}
                }
                }, 500);
            }
        });

        $('body').on('mouseleave', tag, (ev) => {
            const $target = $(ev.currentTarget);
            const a = $target.find('a');
            const $link = a.eq(0).length !== 0 ? a.eq(0) : $target;
            const href = $.trim($link.attr('href'));

            if (reg.test(href)) {
                let $tip = '';
                if (that.type === 'book') {
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

                //$target.data('allow', false);
                //$target.data('movein', true);
            }
        });
    }
}

jQuery.fn.mouseIsOver = function () {
    return $(this).parent().find($(this).selector + ":hover").length > 0;
};
