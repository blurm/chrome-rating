class Template {
    constructor(data, type) {
        this.data = data || {};
        this.type = type;
    }

    /**
     * 显示简介浮层
     * $list current target
     * type loading/error/book/movie
     */
    showTips($list, type) {
        let renderOutput = '';
        switch (type) {
            case 'loading':
                renderOutput = this.renderLoadIntro();
                break;

            case 'error':
                renderOutput = this.renderErrorIntro();
                break;

            case 'movie':
                renderOutput = this.renderMovieIntro();
                break;

            case 'book':
                renderOutput = this.renderBookIntro();
                break;

            default:
        }

        $('#doubanx-subject-tip').remove();
        const $body = $('body');

        $body.append(renderOutput);
        const bodyW = $body.width();

        // 允许我们检索一个元素 (包含其 border 边框，不包括 margin) 相对于文档（document）的当前位置
        const listT = $list.offset().top;
        const listL = $list.offset().left;
        const listW = $list.width();
        const listH = $list.height();

        const $tips = $('#doubanx-subject-tip');
        const tipsW = $tips.width();
        const tipsH = $tips.height();

        if (bodyW - (listW + listL) > tipsW)
            // 优先在右侧展示
        {
            $tips.css({
                top: listT,
                left: listW + listL
            });
        }
        // 其次在左侧展示
        else if (listL > tipsW)
        {
            $tips.css({
                top: listT,
                left: listL - tipsW
            });
        }
    }

    /**
     * 渲染图书简介
     */
    renderBookIntro() {
        const data = this.data;

        const title = data.title || '';
        const originTitle = data.originTitle || '';

        const author = data.author !== '' ? `<li>
                                     <span class="douban-label">作者：</span>
                                     <span>${data.author}</span>
                                 </li>` : '';

        const translator = data.translator !== '' ? `<li>
                                     <span class="douban-label">译者：</span>
                                     <span>${data.translator}</span>
                                 </li>` : '';
        const publisher = data.publisher !== '' ? `<li>
                                     <span class="douban-label">出版社：</span>
                                     <span>${data.publisher}</span>
                                 </li>` : '';
        const summary = data.summary !== '' ? `<p>${data.summary}</p>` : '';

        const rate = this.renderRate();

        return `<div id="doubanx-subject-tip" class="doubanx-subject-tip-book">
                    <div class="doubanx-rating-logo">豆瓣简介</div>
                    <div class="doubanx-subject-tip-hd">
                        <h3>
                            <a href="https://${data.type}.douban.com/subject/${data.id}" target="_blank"><span>${title}</span></a>
                        </h3>
                        ${originTitle}
                    </div>
                    ${rate}
                    <div class="doubanx-subject-tip-bd">
                        <ul>
                            ${author}
                            ${translator}
                            ${publisher}
                        </ul>
                        ${summary}
                    </div>
                </div>`;
    }

    renderMovieIntro() {
        const data = this.data;

        const title = data.title || '';
        const originTitle = data.originTitle || '';

        const director = data.director !== '' ? `<li>
                                     <span class="douban-label">导演：</span>
                                     <span>${data.director}</span>
                                 </li>` : '';

        const stars = data.stars !== '' ? `<li>
                                     <span class="douban-label">主演：</span>
                                     <span>${data.stars}</span>
                                 </li>` : '';
        const genre = data.genre !== '' ? `<li>
                                     <span class="douban-label">类型：</span>
                                     <span>${data.genre}</span>
                                 </li>` : '';
        const summary = data.summary !== '' ? `<p>${data.summary}</p>` : '';

        const rate = this.renderRate();

        return `<div id="doubanx-subject-tip" class="doubanx-subject-tip-book">
                    <div class="doubanx-rating-logo">豆瓣简介</div>
                    <div class="doubanx-subject-tip-hd">
                        <h3>
                            <a href="https://${data.type}.douban.com/subject/${data.id}" target="_blank"><span>${title}</span></a>
                        </h3>
                        ${originTitle}
                    </div>
                    ${rate}
                    <div class="doubanx-subject-tip-bd">
                        <ul>
                            ${director}
                            ${stars}
                            ${genre}
                        </ul>
                        ${summary}
                    </div>
                </div>`;
    }
    renderRate() {
        const data = this.data;
        if (data.ratingNum > 10 || this.type === 'movie') {
            return `<div id="doubanx_rating">
                        <a href="javascript:;" class="doubanx_close"></a>
                        <div class="rating_wrap clearbox">
                            <div class="rating_self clearfix">
                                <strong class="ll rating_num">${data.rating}</strong>
                                <div class="rating_right">
                                    <div class="ll doubanx_star${data.star}"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/collections" class="rating_people" target="_blank"><span>${data.ratingNum}</span>人评价</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        } else {
            return `<div id="doubanx_rating">
                            <div class="doubanx-rating-logo">豆瓣评分</div>
                            <div class="rating_self clearfix">
                                <strong class="ll rating_num"></strong>
                                <span content="10.0"></span>
                                <div class="rating_right not_showed">
                                    <div class="ll doubanx_star00"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/collections" target="_blank">评价人数不足</a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        }
    }

    /**
     * 渲染错误
     */
    renderErrorIntro() {
        const data = this.data;
        return `<div id="doubanx-subject-tip">
                    <div class="doubanx-rating-logo">豆瓣简介</div>
                    <div class="doubanx-subject-tip-hd">
                        <h3>暂无数据 :(</h3>
                        <br>
                        ${data.errMsg}
                    </div>
                </div>`;
    }
    /**
     * 渲染简介前的Loading
     */
    renderLoadIntro() {
        return `<div id="doubanx-subject-tip">
                    <div class="doubanx-rating-logo">
                        内容正在加载中...
                    </div>
                    <div class="loader-inner ball-grid-pulse">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>`;
    }
}
