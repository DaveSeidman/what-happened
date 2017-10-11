const gulp = require('gulp')
const webpack = require('gulp-webpack')
const rsync = require('gulp-rsync')
const config = require('./config.json')

gulp.task('deploy', function() {
  return gulp.src(['dist/**','server.js','config.json'])
    .pipe(rsync({
      root: './',
      hostname: `${config.aws.user}@${config.aws.host}`,
      destination: '/home/ec2-user/what-happened/',
      delete: true,
      silent: false,
      update: true,
      progress: true
    }))
})

gulp.task('webpack', function() {
  return gulp.src('./src/index.jsx')
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest('./dist/'))
})

gulp.task('default', ['webpack', 'deploy'])
