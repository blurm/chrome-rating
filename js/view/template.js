const DUR_FO_TIP = 100 // duration for tip fade out animation
const DUR_FI_TIP_DETAIL = 300 // duration for tip detail fading in

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

        //如果是loading，则把原先的div删除掉。否则，在loading的div上更新内容
        if (type === 'loading') {
            $('.book-douban').remove();
            $('body').append(this.renderContainer());
            $('.book-douban .container').append(renderOutput);
        } else {
            $('.book-douban .container').empty();
            let $appendTo = $('.book-douban .container').hide().append(renderOutput).fadeIn(DUR_FI_TIP_DETAIL);

            // 右上方关闭按钮的注册事件
            $('.book-douban').on('click', '.doubanx_close', (ev) => {
                console.log('douban close');
                ev.preventDefault();
                const $target = $(ev.currentTarget);
                //$tips.toggleClass('animated fadeOutRightBig');
                $tips.fadeOut(DUR_FO_TIP);
                setTimeout(() => {
                    $tips.remove();
                }, DUR_FO_TIP);
            });
        }

        const $tips = $('.book-douban');

        const $body = $('body');
        const bodyW = $body.width();

        // 允许我们检索一个元素 (包含其 border 边框，不包括 margin) 相对于文档（document）的当前位置
        const listT = $list.offset().top;
        const listL = $list.offset().left;
        const listW = $list.width();
        const listH = $list.height();

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
                                     <span class="label">作者：</span>
                                     <span>${data.author}</span>
                                 </li>` : '';

        const translator = data.translator !== '' ? `<li>
                                     <span class="label">译者：</span>
                                     <span>${data.translator}</span>
                                 </li>` : '';
        const publisher = data.publisher !== '' ? `<li>
                                     <span class="label">出版社：</span>
                                     <span>${data.publisher}</span>
                                 </li>` : '';
        const summary = data.summary !== '' ? `<p>${data.summary}</p>` : '';

        const rate = this.renderRate();
        const tags = this.renderTags(data.tags);

        return `<div class="book-douban-head">
                    <h3>
                        <a href="https://${data.type}.douban.com/subject/${data.id}" target="_blank"><span>${title}</span></a>
                    </h3>
                    ${originTitle}
                </div>
                ${rate}
                ${tags}
                <div class="book-douban-details">
                    <ul>
                        ${author}
                        ${translator}
                        ${publisher}
                    </ul>
                    ${summary}
                </div>`;
    }

    renderMovieIntro() {
        const data = this.data;

        const title = data.title || '';
        const originTitle = data.originTitle || '';

        const director = data.director !== '' ? `<li>
                                     <span class="label">导演：</span>
                                     <span>${data.director}</span>
                                 </li>` : '';

        const stars = data.stars !== '' ? `<li>
                                     <span class="label">主演：</span>
                                     <span>${data.stars}</span>
                                 </li>` : '';
        const genre = data.genre !== '' ? `<li>
                                     <span class="label">类型：</span>
                                     <span>${data.genre}</span>
                                 </li>` : '';
        const summary = data.summary !== '' ? `<p>${data.summary}</p>` : '';

        const rate = this.renderRate();

        return `<div class="book-douban">
                    <div class="logo">豆瓣简介</div>
                    <div class="book-douban-head">
                        <h3>
                            <a href="https://${data.type}.douban.com/subject/${data.id}" target="_blank"><span>${title} (${data.year})</span></a>
                        </h3>
                        ${originTitle}
                    </div>
                    ${rate}
                    <div class="book-douban-details">
                        <ul>
                            ${director}
                            ${stars}
                            ${genre}
                             <li>
                                 <span>
                                    <div class="video_tags">
                                        <span class="tag_item">科幻</span>
                                        <span class="tag_item">剧情</span>
                                        <span class="tag_item">惊悚</span>
                                    </div
                                 </span>
                             </li>
                        </ul>
                        ${summary}
                    </div>
                </div>`;
    }

    renderTags(tags) {
        let result = `<div class="tag_group">`;
        for (const tag of tags) {
            tag.title;
            // TODO
            result += `<span class="">
                <a class="tag" href="https://book.douban.com/tag/${tag.name}">${tag.title}</a></span>`;
        }

        result += `</div>`;
        return result;
    }

    renderRate() {
        const data = this.data;
        if (data.ratingNum > 10 || this.type === 'movie') {
            return `<div class="rating">
                        <a href="javascript:;" class="doubanx_close"></a>
                        <div class="rating_wrap clearbox">
                            <div class="rating_self clearfix">
                                <strong class="ll rating_num">${data.rating}</strong>
                                <div class="rating_right">
                                    <div class="ll douban_star${data.star}"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/collections" class="rating_people" target="_blank"><span>${data.ratingNum}</span>人评价</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        } else {
            return `<div class="rating">
                            <div class="logo">豆瓣评分</div>
                            <div class="rating_self clearfix">
                                <strong class="ll rating_num"></strong>
                                <span content="10.0"></span>
                                <div class="rating_right not_showed">
                                    <div class="ll douban_star00"></div>
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
        return `<div class="book-douban-head">
                    <h3>暂无数据 :(</h3>
                    <br>
                    ${data.errMsg}
                </div>`;
    }
    /**
     * 渲染简介前的Loading
     */
    renderLoadIntro() {
        return `<div>内容正在加载中...</div>
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
                </div>`;
    }

    renderContainer() {
        return `<div class="book-douban">
                    <div class="logo">
                        <div id="douban_logo" class="nav-logo">
                            <a href="https://book.douban.com" alt="douban" target="_blank">douban</a>
                        </div>
                    </div>
                    <div class="container">
                    </div>
                </div>`;
    }
}
