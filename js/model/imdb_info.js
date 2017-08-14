class IMDBInfo extends BaseInfo {
    constructor(options) {
        super(options);
        this.url = "https://www.theimdbapi.org/api/find/movie";
    }
    getParams() {
        const params = {
            title : this.name,
            year : this.year
        };

        return params;
    }

    getRatingInfo() {
        const data = {};
        this.get((json) => {
            const movie = json[0];
            data.title = movie.title;
            data.year = movie.year;
            data.rating = movie.rating;
            data.ratingNum = movie.rating_count;
            data.genre = movie.genre.join(', ');
            data.director = movie.director;
            data.stars = movie.stars.join();
        });

        return data;
    }
}
