const DUR_FO_TIP = 300; // duration for tip fade out animation
const DUR_FI_TIP_DETAIL = 300; // duration for tip detail fading in
const DUR_FI_IMDB_RATING = 500; // duration for tip detail fading in
const EXTENSION_ID = chrome.runtime.id;

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
            $mainDiv = '#rating4U_movie';
        }

        //如果是loading，则把原先的div删除掉。否则，在loading的div上更新内容
        if (type === 'loading') {
            $($mainDiv).remove();
            $('body').append(this.renderContainer());
            $($mainDiv + ' .m_r_container').append(renderOutput);
        } else {
            $($mainDiv + ' .m_r_container').empty();
            let $appendTo = $($mainDiv + ' .m_r_container').hide().append(renderOutput).fadeIn(DUR_FI_TIP_DETAIL);

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
        const listT = $list.offset().top - 34;
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
        const tags = this.renderTags(data.genre);
        const summary = data.summary !== '' ? `<p>${data.summary}</p>` : '';
        const rate = this.renderRate();

        return `<div class="movie-rating-head">
                        <h3>
                            <span>${title}</span>
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
        const $imdb = $('.imdb_rating .ratings_wrapper');
        let html = `<div class="imdbRating">
                        <a href="http://www.imdb.com/title/${data.id}" target="_blank">
                            <div class="ratingValue">
                                <strong><span>${data.rating}</span></strong><span class="grey">/</span><span class="grey">10</span>
                            </div>
                        </a>
                        <span class="small">
                            <a href="http://www.imdb.com/title/${data.id}/reviews" target="_blank">${data.ratingNum}</a>
                        </span>
                    </div>`;
        $imdb.empty();
        $imdb.hide().append(html).fadeIn(DUR_FI_IMDB_RATING);
    }

    showIMDBError() {
        let data = this.data;
        // 获得imdb 外层div
        const $imdb = $('.imdb_rating .ratings_wrapper');
        let html = `<div class="error_info">
                    <div class="error_wrapper">
                        <img src="chrome-extension://${EXTENSION_ID}/css/images/oops.png">
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
            result += `<span class="">
                <a class="tag" href="https://${this.data.type}.douban.com/tag/${tag}" target="_blank">
                    ${tag}
                </a></span>`;
        }

        result += `</div>`;
        return result;
    }

    renderRate() {
        const data = this.data;
        let result = '';
        let doubaRatingLogo = '';
        let imdbRating = '';
        if (this.type === 'movie') {
            doubaRatingLogo = `<div class="rating_logo">
                                    <span class="rating_logo_douban">
                                        <i class="rating_logo_douban_sm">
                                            豆瓣
                                    </i>
                                        <span class="icon_text">电影</span>
                                    </span>
                                </div>`;
            const imdbRatingLogo = `<div class="rating_logo">
                                        <span class="rating_logo_imdb">
                                            <i class="rating_logo_imdb_sm">
                                                IMDb
                                            </i>
                                        </span>
                                    </div>`;
            imdbRating = `<div class="imdb_rating">
                                ${imdbRatingLogo}
                                <div class="ratings_wrapper">
                                    <div class="loader-inner ball-pulse">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                        </div>`;
        }
        if (data.ratingNum <= 10) {
            // 评价人数不足
            result += `<div class="rating_section">
                            <div class="douban_rating">
                                ${doubaRatingLogo}
                                <strong class="rating_num"></strong>
                                <span content="10.0"></span>
                                <div class="rating_star not_showed">
                                    <div class="ll douban_star00"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/reviews" target="_blank">评价人数不足</a>
                                    </div>
                                </div>
                            </div>
                            ${imdbRating}
                        </div>`;
        } else {
            // 正常显示评分
            result += `<div class="rating_section">
                            <div class="douban_rating">
                                ${doubaRatingLogo}
                                <a href="https://${data.type}.douban.com/subject/${data.id}" target="_blank">
                                    <strong class="rating_num">${data.rating}</strong>
                                </a>
                                <div class="rating_star">
                                    <div class="ll douban_star${data.star}"></div>
                                    <div class="rating_sum">
                                        <a href="https://${data.type}.douban.com/subject/${data.id}/reviews" class="rating_people" target="_blank"><span>${data.ratingNum}</span>人评价</a>
                                    </div>
                                </div>
                            </div>
                            ${imdbRating}
                        </div>`;
        }
        return result;
    }

    /**
     * 渲染错误
     */
    renderErrorIntro() {
        const data = this.data;
        return `<div class="error_info">
                    <div class="error_wrapper">
                        <img src="chrome-extension://${EXTENSION_ID}/css/images/oops.png">
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
                    <div class="m_r_container">
                    </div>
                </div>`;
        }
        return `<div id="rating4U_movie">
                    <div class="logo">
                        <a href="javascript:;" class="rating_close"></a>
                    </div>
                    <div class="m_r_container">
                    </div>
                </div>`;
    }
}
