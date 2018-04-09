let fs = require('fs');
let gulp = require('gulp');
let gulpRename = require('gulp-rename');
let gulpPrepend = require('gulp-append-prepend');

/* Change these as needed */
const themeFileSrc = './slack.css';
const slackFileName = 'lato-2-compressed-mac.css';
const slackDestinationPath = './a.slack-edge.com/d5819/style/libs/';
const slackFonts = getSlackFonts();

gulp.task('watch', () => {
  gulp.watch(themeFileSrc, ['copy-to-slack']);
})

gulp.task('copy-to-slack', () => {
  return gulp
    .src(themeFileSrc)
    .pipe(gulpPrepend.prependText(slackFonts))
    .pipe(gulpRename(slackFileName))
    .pipe(gulp.dest(slackDestinationPath));
})


/* Helper Functions */
function getSlackFonts() {
  let data = fs.readFileSync(slackDestinationPath + slackFileName, 'utf8');
  var lines = data.split('\n').slice(0, 8);
  return lines;
}
