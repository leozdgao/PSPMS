var express = require('express');
var router = express.Router();

var request = require("request");
var url = require("url");

var proxyDic = require("./../config.json").proxyDic || {};

for (var key in proxyDic) {

	router.use(key, proxyHandler(proxyDic[key]));
}

module.exports = router;

function proxyHandler(path) {

	return function(req, res, next) {

		// console.log('message');

		var reqUrl = url.resolve(path, req.originalUrl);

		console.log(reqUrl);

		var option = {
			url: reqUrl,
			method: req.method,
			headers: req.headers,
		};

		req.pipe(request(option)).pipe(res);
	}
}