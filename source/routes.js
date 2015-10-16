var controllers = require('./controllers');

var routes = {};
routes["/"] = controllers.index;

exports.routes = routes;
exports.fileNotFound = controllers.fileNotFound;
exports.staticFile = controllers.staticFile;
