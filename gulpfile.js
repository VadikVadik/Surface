var gulp         = require('gulp'),
    jade         = require('gulp-jade'),
	stylus       = require('gulp-stylus'),
	browserSync  = require('browser-sync'),
	plumber      = require('gulp-plumber'),
	postcss      = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	mqpacker     = require('css-mqpacker'),
	csso         = require('gulp-csso'),
	rename       = require('gulp-rename'),
	imagemin     = require('gulp-imagemin'),
	spritesmith  = require('gulp.spritesmith'),
	svgmin       = require('gulp-svgmin'),
	svgstore     = require('gulp-svgstore'),
	del          = require('del'),
	run          = require('run-sequence');
 
gulp.task('jade', function() {
    return gulp.src('app/index.jade')
        .pipe(plumber())
		.pipe(jade({
			pretty: true
		})) 
        .pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('style', function () {
	return gulp.src('app/styles/app.styl')
    	.pipe(stylus())
		.pipe(postcss([
			autoprefixer({browsers: [
				"last 2 versions"
			]}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(rename("style.css"))
		.pipe(gulp.dest('dist/css'))
		.pipe(csso())
		.pipe(rename("style.min.css"))
    	.pipe(gulp.dest('dist/css'))
    	.pipe(browserSync.reload({stream: true}));
});

gulp.task('normalize', function () {
	return gulp.src('app/styles/normalize.css')
    	.pipe(csso())
		.pipe(gulp.dest('dist/css'))
    	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sprite', function() {
    var spriteData = 
        gulp.src('app/icons/**.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                cssTemplate: 'stylus.template.mustache',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('dist/images/'));
    spriteData.css.pipe(gulp.dest('app/styles/helpers'));
});

gulp.task('images', function() {
	return gulp.src("dist/images/**/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optimizationlevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('symbols', function() {
	return gulp.src("dist/images/icons/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('copy', function() {
	return gulp.src([
		"app/fonts/**/*.{woff,woff2}",
		"app/images/**",
		"app/scripts/**"
	], {
		base: "app/."
	})
	.pipe(gulp.dest('dist'));
});

gulp.task('build', function(fn) {
	run(
		"clean",
		"copy",
		"jade",
		"normalize",
		"sprite",
		"style",
		"images",
		"symbols",
		fn
	);
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/**/*.styl', ['style']),
	gulp.watch('app/**/*.jade', ['jade']),
	gulp.watch('app/scripts/**/*.js', browserSync.reload);
});