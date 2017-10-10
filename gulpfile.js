const gulp = require('gulp')
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