const DUR_FO_TIP = 300; // duration for tip fade out animation
const DUR_FI_TIP_DETAIL = 300; // duration for tip detail fading in

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

        let $mainDiv = '';
        if (this.type === 'book') {
            $mainDiv = '.book-douban';
        } else {
            $mainDiv = '.movie-rating';
        }

        //如果是loading，则把原先的div删除掉。否则，在loading的div上更新内容
        if (type === 'loading') {
            $($mainDiv).remove();
            $('body').append(this.renderContainer());
            $($mainDiv + ' .container').append(renderOutput);
        } else {
            $($mainDiv + ' .container').empty();
            let $appendTo = $($mainDiv + ' .container').hide().append(renderOutput).fadeIn(DUR_FI_TIP_DETAIL);

            // 右上方关闭按钮的注册事件
            $($mainDiv).on('click', '.rating_close', (ev) => {
                console.log('rating close');
                ev.preventDefault();
                const $target = $(ev.currentTarget);
                //$tips.toggleClass('animated fadeOutRightBig');
                $tips.fadeOut(DUR_FO_TIP);
                setTimeout(() => {
                    $tips.remove();
                }, DUR_FO_TIP);
            });
        }

        const $tips = $($mainDiv);

        const $body = $('body');
        const bodyW = $body.width();

        // 允许我们检索一个元素 (包含其 border 边框，不包括 margin) 相对于文档（document）的当前位置
        const listT = $list.offset().top - 54;
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
            if (!$tips.hasClass('left')) {
                $tips.addClass('left');
            }
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
        let tags = `<div class="tag_group">`;
        for (const tag of data.genre) {
            tags += `<span class="">
                <a class="tag" href="">${tag}</a></span>`;
        }

        tags += `</div>`;
        const summary = data.summary !== '' ? `<p>${data.summary}</p>` : '';

        const rate = this.renderRate();

        return `<div class="movie-rating-head">
                        <h3>
                            <a href="https://${data.type}.douban.com/subject/${data.id}" target="_blank"><span>${title}</span></a>
                            <span class="year">(${data.year})</span>
                        </h3>
                        <div class="originTitle">${originTitle}</div>
                    </div>
                    ${rate}
                    ${tags}
                    <div class="movie-rating-details">
                        <ul>
                            ${director}
                            ${stars}
                        </ul>
                        ${summary}
                    </div>
                </div>`;
    }

    showIMDBRating() {
        let data = this.data;
        // 获得imdb 外层div
        const $imdb = $('.imdb_rating');
        let html = `<div class="ratings_wrapper">
                        <div class="imdbRating">
                                <a href="http://www.imdb.com/title/${data.id}" target="_blank">
                            <div class="ratingValue">
                                <strong><span>${data.rating}</span></strong><span class="grey">/</span><span class="grey">10</span>
                            </div>
                                </a>
                            <span class="small">${data.ratingNum}</span>
                        </div>
                    </div>
            `;
        $imdb.empty();
        $imdb.append(html);
    }

    showIMDBError() {
        let data = this.data;
        // 获得imdb 外层div
        const $imdb = $('.imdb_rating');
        let html = `<div class="error_info">
                    <div class="error_wrapper">
                        <img src="chrome-extension://imooppmfkkhafmgkjnmbanmpebakjfoh/css/images/oops.png">
                        <div class="message">
                            ${data.errMsg}
                        </div>
                    </div>
                </div>`;
        $imdb.empty();
        $imdb.append(html);
    }
    renderTags(tags) {
        let result = `<div class="tag_group">`;
        for (const tag of tags) {
            tag.title;
            result += `<span class="">
                <a class="tag" href="https://book.douban.com/tag/${tag.name}">
                    ${tag.title}
                </a></span>`;
        }

        result += `</div>`;
        return result;
    }

    renderRate() {
        const data = this.data;
        let result = '';
        if (data.ratingNum <= 10) {
            // 评价人数不足
            result += `<div class="rating">
                            <div class="douban_rating">
                                <strong class="rating_num"></strong>
                                <span content="10.0"></span>
                                <div class="rating_star not_showed">
                                    <div class="ll douban_star00"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/collections" target="_blank">评价人数不足</a>
                                    </div>
                                </div>
                            </div>`;
        } else {
            // 正常显示评分
            result += `<div class="rating">
                            <div class="douban_rating">
                                <strong class="rating_num">${data.rating}</strong>
                                <div class="rating_star">
                                    <div class="ll douban_star${data.star}"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/collections" class="rating_people" target="_blank"><span>${data.ratingNum}</span>人评价</a>
                                    </div>
                                </div>
                            </div>`;

        }

        // IMD评分子div
        if (this.type === 'movie') {
            if (!TEST_MODE || TEST_UI_LOADER) {
                result += `<div class="imdb_rating">
                           <div class="loader-inner ball-pulse">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                       </div>`;
            } else {
                result += `<div class="imdb_rating">
                            <div class="ratings_wrapper">
                                <div class="imdbRating">
                                    <div class="ratingValue">
                                        <strong><span>7</span></strong><span class="grey">/</span><span class="grey">10</span>
                                    </div>
                                    <span class="small">3,683</span>
                                </div>
                            </div>
                        </div>`;
            }
        }

        result += `</div>`;
        return result;
    }

    /**
     * 渲染错误
     */
    renderErrorIntro() {
        const data = this.data;
        return `<div class="error_info">
                    <div class="error_wrapper">
                        <img src="chrome-extension://imooppmfkkhafmgkjnmbanmpebakjfoh/css/images/oops.png">
                        <div class="message">
                            ${data.errMsg}
                        </div>
                    </div>
                </div>`;
    }
    /**
     * 渲染简介前的Loading
     */
    renderLoadIntro() {
        return `<div class="main_loader">
                    <div>内容正在加载中...</div>
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

    renderContainer() {
        if (this.type === 'book') {
            return `<div class="book-douban">
                    <div class="logo">
                        <div id="douban_logo" class="nav-logo">
                            <a href="https://book.douban.com" alt="douban" target="_blank">douban</a>
                        </div>
                        <a href="javascript:;" class="rating_close"></a>
                    </div>
                    <div class="container">
                    </div>
                </div>`;
        }
        return `<div class="movie-rating">
                    <div class="logo">
                        <a href="javascript:;" class="rating_close"></a>
                    </div>
                    <div class="container">
                    </div>
                </div>`;
    }
}
