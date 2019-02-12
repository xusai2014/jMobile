import hook from 'css-modules-require-hook';
var stylus = require('stylus');
hook({
  prepend: [
    // adding CSS Next plugin

  ],
  preprocessCss: function (css, filename) {
    return stylus(css)
      .set('filename', filename)
      .render();
  }
});