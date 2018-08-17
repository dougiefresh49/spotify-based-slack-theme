let fs = require('fs');
let gulp = require('gulp');
let gulpRename = require('gulp-rename');
let gulpPrepend = require('gulp-append-prepend');
let runSequence = require('run-sequence');
var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var log = require('gulplog');
var git = require('gulp-git');

/* Change these as needed */
// const themeFileSrc = './spotify-theme.css';
// const slackFileName = 'lato-2-compressed-mac.css';
// const slackDestinationPath = './a.slack-edge.com/d5819/style/libs/';
// const slackFonts = getSlackFonts();

// gulp.task('watch', () => {
//   gulp.watch(themeFileSrc, ['copy-to-slack']);
// })

// gulp.task('copy-to-slack', () => {
//   return gulp
//     .src(themeFileSrc)
//     .pipe(gulpPrepend.prependText(slackFonts))
//     .pipe(gulpRename(slackFileName))
//     .pipe(gulp.dest(slackDestinationPath));
// })


/* Helper Functions */
// function getSlackFonts() {
//   let data = fs.readFileSync(slackDestinationPath + slackFileName, 'utf8');
//   var lines = data.split('\n').slice(0, 8);
//   return lines;
// }

// Automation
gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular' // Or to any other commit message convention you use.
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('github-release', function(done) {
  conventionalGithubReleaser({
    type: "oauth",
    token: process.env.GIT_KEY // change this to your own GitHub token or use an environment variable
  }, {
    preset: 'angular' // Or to any other commit message convention you use.
  }, done);
});

gulp.task('bump-version', function () {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: "patch"}).on('error', log.error))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('build(package): bump version number'));
});

gulp.task('push-changes', function (done) {
  git.push('origin', 'feat/demo-empty', done);
});

gulp.task('create-new-tag', function (done) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return done(error);
    }
    git.push('origin', 'feat/demo-empty', {args: '--tags'}, done);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('release', (cb) => {
  runSequence(
    'bump-version',
    'changelog',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    'github-release'
    , cb);
});