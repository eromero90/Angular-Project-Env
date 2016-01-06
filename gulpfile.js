var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({rename:{'gulp-ng-html2js':'ngHtml2Js'}});
var bowerFiles = require('main-bower-files');
var bourbon = require('node-bourbon');

// PATHS
var paths = {
	scripts: ['./dev/_scripts/**/*.js', './dev/_scripts/app.js'],
	styles: ['./dev/_sass/**/*.scss', './dev/_scripts/**/*.scss'],
	partials: ['./dev/_scripts/**/*.html'],
	bowerDir: ['./bower_components'],
	assets: ['./dev/_assets/**/*'],
	allHtml: ['./dev/index.html', './dev/_scripts/**/*.html'],
	index: './dev/index.html',
	sassDirectiveDir: './dev/_scripts/',
	public: '/public',
	publicCss: '/public/css',
	publicJs: '/public/js',
	publicAssets: '/public/assets',
	vendorJs: '/vendors',
	devDir: './dev',
	prodDir: './prod'
};

// FUNCTIONS

//Lint js
var lint = function() {
	return gulp.src(paths.scripts)
			.pipe(plugins.plumber())
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter('jshint-stylish'));
};

//hint html
var hintHtml = function () {
	return gulp.src(paths.allHtml)
			.pipe(plugins.htmlhint())
			.pipe(plugins.htmlhint.reporter());
}

//hint index
var hintIndex = function () {
	return gulp.src(paths.index)
			.pipe(plugins.htmlhint())
			.pipe(plugins.htmlhint.reporter());
}

//hint html partials
var hintPartials = function () {
	return gulp.src(paths.partials)
			.pipe(plugins.htmlhint({'doctype-first':false}))
			.pipe(plugins.htmlhint.reporter())
			.pipe(gulp.dest(paths.devDir+paths.publicJs));
}


//Compile SASS
var compileSass = function() {
	return gulp.src(paths.styles)
			.pipe(plugins.plumber())
			.pipe(plugins.sass({
					includePaths:[
						paths.sassDirectiveDir,
						bourbon.includePaths
					],
					sourceComments: 'normal'
				}))
			.pipe(gulp.dest(paths.devDir+paths.publicCss));
};

//Add scripts to public
var addScripts = function () {
	return lint()
		.pipe(plugins.angularFilesort())
		.pipe(gulp.dest(paths.devDir+paths.publicJs));
}

//Add bower components to public
var addBowerComponents = function () {
	return gulp.src(bowerFiles())
			.pipe(gulp.dest(paths.devDir+paths.publicJs+paths.vendorJs));
};

//Add assets to public
var addAssets = function() {
    return gulp.src(paths.assets)
        .pipe(gulp.dest(paths.devDir+paths.publicAssets));
};


//TASK
var buildDev = function () {
	//write bower components to public
	var addedBowerScripts = addBowerComponents();

	//lint, order angular files, write to public
	var appScripts = addScripts();

	//app styles
	var appStyles = compileSass();

	//Add assets to public
	addAssets();

	//Add partials
	hintPartials();


	//Build app index and write to public
	return hintIndex()
			.pipe(gulp.dest(paths.devDir+paths.public))//write index to get relative path for inject
			.pipe(plugins.inject(addedBowerScripts, {relative:true, name:'bowerjs'}))//Inject bower js component
			.pipe(plugins.inject(addedBowerScripts, {relative:true, name:'bowercss'}))//Inject bower css component
			.pipe(plugins.inject(appScripts.pipe(plugins.angularFilesort()), {relative:true, name:'scripts'}))//Inject scripts
			.pipe(plugins.inject(appStyles, {relative:true, name:'stylesheets'}))//Inject css
			.pipe(gulp.dest(paths.devDir+paths.public));//write again with all files injected
};



//Gulp Tasks

//Validate js files
gulp.task('lint-js', lint);//not used

//validate and inject sources into index.html. Move to dev environment
gulp.task('build-dev', buildDev);

//Compile SASS
gulp.task('compile-sass', compileSass);//not used



//Main task dev
gulp.task('default', ['build-dev'],function () {
	//start nodemon to auto-reload dev server
	plugins.nodemon({script:'server.js', ext:'js', env:{NODE_ENV:'development'}})
		.on('change', ['lint-js']);

	plugins.watch(paths.styles, function () {
		return compileSass();
	});

	plugins.watch(paths.scripts, function () {
		return addScripts();
	});

	plugins.watch(paths.index, function () {
		return buildDev();
	});

	plugins.watch(paths.partials, function (file) {
		return hintPartials();
	});

});





