(function () {
	var Movie = Backbone.Model.extend({
		defaults: {
			movie_name: "",
			movie_starring: "",
			movie_director: "",
			movie_nation: "",
			movie_release_date: "",
			movie_picture: "",
			movie_score: ""
		}
	});

	var Movies = Backbone.Collection.extend({
		model: Movie,
		url: function () {
			return 'http://api.36wu.com/Movie/GetHotMovie?location=%E5%8C%97%E4%BA%AC&format=json'
		},
		parse: function (response) {
			console.log(response);
			return response;
		}
	});

	var  movies = new Movies();

	movies.fetch({
		success: function (model, response) {
			_.each(response.data.movie, function (item){
				var movie = new Movie(item); 
				movies.add(movie);
			});

			console.log(movies)
		}
	});

	var  MovieView = Backbone.View.extend({
		className: "movie-container col s3",
		template: _.template($("#movieTemplate").html()),
		render_score: function () {
			var score = this.model.get("movie_score");
			for (var i=0;i<Math.floor(score/2);i++) {
				this.$el.find(".grade").append('<i class="mdi-action-grade "></i>')
			}
			if (score%2>1) {
				this.$el.find(".grade").append('<i class="mdi-action-grade opca"></i>')
			}
		},
		render: function () {
			console.log("Model data 1 by 1: ");
	        console.log(this.model.toJSON());
	        this.$el.html(this.template(this.model.toJSON()));
	        this.render_score();
	        return this;
			}
		});
	var MoviesView = Backbone.View.extend({
		el: $(".row"),
		initialize: function () {
			this.collection = movies;
			this.render();
			this.collection.on("reset", this.render, this);
			this.collection.on("add", this.renderMovies, this);
		},
		render: function () {
			_.each(this.collection.models, function (item) {
				this.renderMovies(item);
			}, this);
		},
		renderMovies: function (item) {
			if(item.get('movie_name') !== ''){
				var movieView = new MovieView({model: item});
				this.$el.append(movieView.render().el);
				/*movieView.render_score();*/
			}
			
		}
	})

	var moviesV =new MoviesView;

})();