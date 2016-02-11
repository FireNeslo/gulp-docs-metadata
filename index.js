var babel = require('babel-core')
var docify = require('./transform/docs')
var through = require('through2')

module.exports = function jsonDocs(options) {
  if(!options) options = {}
  if(!options.plugins) options.plugins = []
  if(!options.presets) options.presets = []
  options.comments = true
  options.presets.push(require("babel-preset-es2015"))
  options.presets.push(require("babel-preset-stage-0"))
  options.plugins.push(require("babel-plugin-transform-decorators-legacy").default)
  options.plugins.push(require("babel-plugin-transform-class-properties"))
  options.plugins.push(docify)

  function onFile(file, ecoding, callback) {
    var contents = babel.transform(file.contents.toString(), options).code
    var json = JSON.parse(contents.slice(contents.indexOf('=')+1, -1))
    file.path = file.path.replace(/\.js$/, '.json')
    file.contents = new Buffer(JSON.stringify(json, null, 2))
    this.push(file)
    callback()
  }

  return through.obj(onFile)
}
