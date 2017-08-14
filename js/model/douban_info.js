const ERR_MSG_MAP = new Map();
ERR_MSG_MAP.set(1001, '没有找到您要的内容');

ERR_MSG_MAP.set(100, 'invalid_request_scheme 错误的请求协议');
ERR_MSG_MAP.set(101, 'invalid_request_method 错误的请求方法');
ERR_MSG_MAP.set(102, 'access_token_is_missing 未找到 access_token');
ERR_MSG_MAP.set(103, 'invalid_access_token access_token 不存在或已被用户删除，或者用户修改了密码');
ERR_MSG_MAP.set(104, 'invalid_apikey apikey 不存在或已删除');
ERR_MSG_MAP.set(105, 'apikey_is_blocked apikey 已被禁用');
ERR_MSG_MAP.set(106, 'access_token_has_expired access_token 已过期');
ERR_MSG_MAP.set(107, 'invalid_request_uri 请求地址未注册');
ERR_MSG_MAP.set(108, 'invalid_credencial1 用户未授权访问此数据');
ERR_MSG_MAP.set(109, 'invalid_credencial2 apikey 未申请此权限');
ERR_MSG_MAP.set(110, 'not_trial_user 未注册的测试用户');
ERR_MSG_MAP.set(111, 'rate_limit_exceeded1 用户访问速度限制');
ERR_MSG_MAP.set(112, 'IP 访问速度限制, 豆瓣限制您每小时最多只能发起100次请求');
ERR_MSG_MAP.set(113, 'required_parameter_is_missing 缺少参数');
ERR_MSG_MAP.set(114, 'unsupported_grant_type 错误的 grant_type');
ERR_MSG_MAP.set(115, 'unsupported_response_type 错误的 response_type');
ERR_MSG_MAP.set(116, 'client_secret_mismatch client_secret不匹配');
ERR_MSG_MAP.set(117, 'redirect_uri_mismatch redirect_uri不匹配');
ERR_MSG_MAP.set(118, 'invalid_authorization_code authorization_code 不存在或已过期');
ERR_MSG_MAP.set(119, 'invalid_refresh_token refresh_token 不存在或已过期');
ERR_MSG_MAP.set(120, 'username_password_mismatch 用户名密码不匹配');
ERR_MSG_MAP.set(121, 'invalid_user 用户不存在或已删除');
ERR_MSG_MAP.set(122, 'user_has_blocked 用户已被屏蔽');
ERR_MSG_MAP.set(123, 'access_token_has_expired_since_password_changed \
                      因用户修改密码而导致 access_token 过期');
ERR_MSG_MAP.set(124, 'access_token_has_not_expired access_token 未过期');
ERR_MSG_MAP.set(125, 'invalid_request_scope 访问的 scope 不合法，开发者不用太关注，一般不会出现该错误');
ERR_MSG_MAP.set(126, 'invalid_request_source 访问来源不合法');
ERR_MSG_MAP.set(127, 'thirdparty_login_auth_faied 第三方授权错误');
ERR_MSG_MAP.set(128, 'user_locked 用户被锁定');
ERR_MSG_MAP.set(999, 'unknown 未知错误');

class DoubanInfo extends BaseInfo {
    constructor(options) {
        super(options);
        this.shortName = options.shortName;

        if (this.type === "book") {
            this.url = "https://api.douban.com/v2/book/search";
            this.author = options.author || ''; // 作者
        } else {
            this.url = "https://api.douban.com/v2/movie/search";
        }
        console.log('options: ', options);
    }

    /**
     * 根据评分数字来计算星星的数量
     * 目前计算的和douban并不一致，只是大概看下
     *
     */
    static countStar(rating) {
        const rateNum = Math.round(rating * 10 / 2);
        let units = rateNum % 10;
        let tens = rateNum - units;
        if (units >= 5) {
            units = 0;
            tens += 10;
        } else {
            units = 5;
        }

        return tens + units;
    }

    /**
     * 生成查询用的参数对象
     *
     */
    getParams() {
        const params = {
            q : this.name
        };
        return params;
    }

    /**
     * 查询评分信息
     *
     */
    getRatingInfo(success, fail) {
        this.get(success, fail);
    }

    /**
     * 将当前作者按‘ ’或者‘，’‘,'分割，然后分别与jsonAuthor匹配，如果全部匹配则返回
     * true
     */
    isMatchAuthor(curAuthor, jsonAuthor) {
        const nameArr = curAuthor.replace(/[·|．|.|,|，]/, ' ').split(/\s/);
        for (const authorJ of jsonAuthor) {
            let isMatched = false;
            for (const namePart of nameArr) {
                if (authorJ.match(namePart)) {
                    isMatched = true;
                    break;
                }
            }
            if (isMatched) {
                return true;
            }
        }
        return false;
    }

    /**
     * 从返回结果生成错误信息对象
     *
     */
    popError(json) {
        const data = {};
        data.type = this.type;
        data.errMsg = ERR_MSG_MAP.get(json.code);

        return data;
    }

    /**
     * 从返回结果生成信息对象
     *
     */
    popData(json) {
        console.log('Request params: ', this.getParams());
        console.log('json result: ', json);
        const data = {};
        data.type = this.type;

        // total=0, 没有查询结果返回
        // total=-1，目前尚不知道是因为什么原因导致,通常再查询一遍就正常了
        if (json.total <= 0) {
            data.errMsg = ERR_MSG_MAP.get(1001);
        } else {
            if (this.type === "book") {
                for (const book of json.books) {
                    // 对于'东野圭吾：鸟人计划'，首先要重新匹配书名，因为结果
                    // 返回的可能是全部东野圭吾的作品
                    if ((book.title.indexOf(this.shortName) >= 0 ||
                            book.subtitle.indexOf(this.shortName) >= 0) &&
                        // 根据作者匹配结果
                           (this.isMatchAuthor(this.author, book.author) ||
                        // 根据译者匹配结果
                            this.isMatchAuthor(this.author, book.translator) ||
                        // 有时作者是出版商
                            book.publisher.indexOf(this.author) !== -1 ||
                        // 如果没有作者信息则直接返回当前记录
                            this.author === ''
                           )
                        ) {

                        data.id = book.id;
                        data.title = book.title;
                        data.originTitle = book.origin_title;
                        data.rating = book.rating.average;
                        data.ratingNum = book.rating.numRaters;
                        data.star = DoubanInfo.countStar(data.rating);
                        data.author = book.author.join('，');
                        data.translator = book.translator.join('，');
                        data.publisher = book.publisher;
                        data.summary = book.summary;

                        break;
                    }
                }

                // 如果没有结果返回
                if (!data.id) {
                    data.errMsg = ERR_MSG_MAP.get(1001);
                }

            } else {
                // 如果是电影信息
                let id;
                for (const s of json.subjects) {
                    if (s.year == this.year) {
                        id = s.id;
                        break;
                    }
                }
                const movie = getSync(
                            'https://api.douban.com/v2/movie/subject/' + id);
                data.title = movie.title;
                data.originalTitle = movie.original_title;
                data.year = movie.year;
                data.rating = movie.rating.average;
                data.ratingNum = movie.ratings_count;
                data.genre = movie.genres.join('，');

                data.director = '';
                data.stars = '';
                for (const d of movie.directors) {
                    data.director += d.name + '，';
                }
                data.director = DoubanInfo.rmComma(data.director);
                for (const c of movie.casts) {
                    data.stars += c.name + '，';
                }
                data.stars = DoubanInfo.rmComma(data.stars);
            }
        }

        return data;
    }
}
