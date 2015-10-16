var http = require("http");
var url = require("url");

function start(routes) {
  var urlRoutes = routes.routes;
  var fileNotFound = routes.fileNotFound;

  function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname;
    if (isStaticResource(pathname)) {
      renderStatic(pathname, req, res);
    }  
    else {
      renderDynamic(pathname, req, res);
    }
  }

  function renderDynamic(pathname, req, res) {
    if (typeof urlRoutes[pathname] === 'function') {
      urlRoutes[pathname](req, res);
    }
    else {
     fileNotFound(req, res);
    }
  }

  function renderStatic(pathname, req, res) {
    routes.staticFile(pathname, req, res);
  }

  function isStaticResource(pathname) {
    return pathname.indexOf('/static/') === 0 && pathname.length > 8;
  }

  var server = http.createServer(onRequest).listen(8888);
}

exports.start = start
