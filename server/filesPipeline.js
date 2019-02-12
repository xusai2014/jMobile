var sass = require('node-sass');
var path = require('path');
var lessParser = require('postcss-less')

module.exports =  {parser:lessParser.parse}