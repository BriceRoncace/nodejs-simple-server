var hogan = require("hogan.js");
var fs = require('fs');
var mime = require('mime');

var CONTEXT_PATH = "views";

function index(req, res) {
  renderHoganFile(CONTEXT_PATH + '/hogan/index.hogan', {subtitle: 'Brought to you by node.js and hogan.js'}, req, res);
}

function fileNotFound(req, res) {
  renderHoganFile(CONTEXT_PATH + '/hogan/404.hogan', {}, req, res, 404);
}

function staticFile(file, req, res) {
  renderStaticFile(file, req, res);
}

function renderHoganFile(file, context, req, res, responseCode) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      fileNotFound(req, res);
      return console.log(err);
    }
    var hoganTmpl = hogan.compile(data);
    var content = hoganTmpl.render(context);
    render(content, null, req, res, responseCode);
  });
}

function renderStaticFile(file, req, res, responseCode) {
  var staticFile = CONTEXT_PATH + file;
  fs.stat(staticFile, function(err, stats) {
    fs.readFile(staticFile, function(err, data) {
      if (err) {
        fileNotFound(req, res);
        return console.log(err);
      }
      render(data, stats, req, res, mime.lookup(file), responseCode);
    });
  });
}

function render(content, stats, req, res, contentType, responseCode) {
  responseCode = responseCode || 200;
  contentType = contentType || 'text/html';
  res.writeHead(responseCode, {'Content-Type': contentType});
  
  if (isBinaryContentType(contentType)) {
    res.contentLength = stats.size;
    res.end(content, 'binary');
  } 
  else {
    res.end(content);
  }
}

function isBinaryContentType(contentType) {
  return (contentType === 'image/jpeg' ||
          contentType === 'image/png' ||
          contentType === 'image/gif' ||
          contentType === 'image/bmp')

}


exports.index = index;
exports.fileNotFound = fileNotFound;
exports.staticFile = staticFile;
