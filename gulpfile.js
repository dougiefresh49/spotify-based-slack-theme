let fs = require('fs');
let gulp = require('gulp');
let gulpRename = require('gulp-rename');
let gulpPrepend = require('gulp-append-prepend');
let runSequence = require('run-sequence');

/* Change these as needed */
const themeFileSrc = './spotify-theme.css';
const slackFileName = 'lato-2-compressed-mac.css';
const slackDestinationPath = 'a.slack-edge.com/0caa1/style/libs/';
const slackFonts = getSlackFonts();

gulp.task('start', (cb) => {
  return runSequence('copy-to-slack', 'watch');
});

gulp.task('watch', () => {
  gulp.watch(themeFileSrc, ['copy-to-slack']);
})

gulp.task('copy-to-slack', () => {
  return gulp
    .src(themeFileSrc)
    .pipe(gulpPrepend.prependText(slackFonts))
    .pipe(gulpRename(slackFileName))
    .pipe(gulp.dest('./chrome-overrides/' + slackDestinationPath));
})


/* Helper Functions */
function getSlackFonts() {
  let data = fs.readFileSync('./chrome-overrides/' + slackDestinationPath + slackFileName, 'utf8');
  var lines = data.split('\n').slice(0, 8);
  return lines;
}
