const ERR_MSG_MAP_IMDB = new Map();
ERR_MSG_MAP_IMDB.set(1001, 'No Result');
ERR_MSG_MAP_IMDB.set(1002, 'No Rating');
ERR_MSG_MAP_IMDB.set(1003, '暂时失联=_="');
ERR_MSG_MAP_IMDB.set(1004, '返回异常 稍后再试');

class IMDBInfo extends BaseInfo {
    set options(options) {
        super.options = options;
        this.url = "https://www.theimdbapi.org/api/find/movie";
        console.log('options: ', options);
    }

    getParams() {
        const params = {
            title : this.name,
            year : this.year
        };

        return params;
    }

    popError(response) {
        const data = {};
        data.type = this.type;

        // 是否timeout
        if (response.readyState == 4 && response.status == 524)
        {
            data.errMsg = ERR_MSG_MAP_IMDB.get(1003);
        } else {
            if (!response.responseJSON) {
                data.errMsg = ERR_MSG_MAP_IMDB.get(1004);
            }

        }

        return data;
    }

    popData(json) {
        if (TEST_MODE) {
            //setTimeout(function () {
                return TEST_DATA_IMDB_MOVIE;
            //}, 0);
        } else {
            console.log('imdb json result:', json);
            const data = {};

            if (json && json.length > 0) {
                const movie = json[0];
                data.id = movie.imdb_id;
                data.title = movie.title;
                data.year = movie.year;
                data.rating = movie.rating;
                data.star = this.countStar(data.rating);
                data.ratingNum = movie.rating_count;
                data.genre = movie.genre.join(', ');
                data.director = movie.director;
                data.stars = movie.stars.join();
                data.summary = movie.description;
            }

            // 如果没有结果返回
            if (!data.title) {
                data.errMsg = ERR_MSG_MAP_IMDB.get(1001);
            } else if (!data.rating || data.rating === ''){
                data.errMsg = ERR_MSG_MAP_IMDB.get(1002);
            }

            console.log('imdb data', data);
            return data;
        }
    }

    getRatingInfo(success, fail) {
        this.get(success, fail);
    }
}
