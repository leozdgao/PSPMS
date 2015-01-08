var express = require('express');
var router = express.Router();

var request = require("request");
var url = require("url");

var config = require("./../config.json");

router.use(function(req, res) {
	var reqUrl = url.resolve("http://10.10.73.207:3000/", req.url);

	var option = {
		url: reqUrl,
		method: req.method,
		headers: req.headers
	};

	request(option, function(err, pres) {

		res.set(pres.headers).status(pres.statusCode).end(pres.body);
	});
})

module.exports = router;