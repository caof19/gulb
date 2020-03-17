const gulp = require('gulp'),
      less = require('gulp-stylus'),
      browSync = require('browser-sync'),
      plumber = require('gulp-plumber'),
      min = require('gulp-csso'),
      pref =  require('gulp-autoprefixer'),
      img = require('gulp-imagemin');
      pug = require('gulp-pug');
      imgCompress  = require('imagemin-jpeg-recompress');
      svgSprite = require('gulp-svg-sprite'),
	  cheerio = require('gulp-cheerio'),
	  replace = require('gulp-replace');

const reload = browSync.reload;

const src = {
    html : 'public/*.pug',
    less : 'public/style.styl',
    img : 'public/img/**/*.jpg',
    svg : 'public/img/*.svg',
}

gulp.task('less1', function() {
    return gulp.src(src.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(min())
        .pipe(pref({
            browsers: ['last 8 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app'))
        .pipe(reload({stream:true}));
})

gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(plumber())
        .pipe(pug({
        	pretty: true
        }))
        .pipe(gulp.dest('app'))
        .pipe(reload({stream:true}));
})

gulp.task('svg', function() {
	return gulp.src(src.svg)
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
        stack: {
					sprite: "sprite.svg",
        }
			}
		}))
		.pipe(gulp.dest('app/icon/'))
		.pipe(reload({stream:true}));
	}
)

gulp.task('img', function() {
    return gulp.src(src.img)
    .pipe(img([
         imgCompress({
          loops: 4,
          min: 70,
          max: 80,
          quality: 'high'
        }),
    ]))
    .pipe(gulp.dest('app/img'))
    .pipe(reload({stream:true}));
})

gulp.task('sync', function() {
    browSync ({
        server : {
            baseDir: 'app'
        },
    });
})

gulp.task('watcher', function() {
    gulp.watch(src.svg, ['svg']);
    gulp.watch(src.less, ['less1']);
    gulp.watch(src.html, ['html']);
    gulp.watch(src.img, ['img']);
})

gulp.task('default', ['watcher', 'sync'])