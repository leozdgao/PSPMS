var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    config = require('./../config'),
    MyProxy = require("./../proxy/myProxy");
    router = express.Router();

// /proxy/*
router.use("/report", function(req, res){
    var proxy = new MyProxy();

    proxy.on('response', function(proxyres){
        res.writeHead(proxyres.statusCode, proxyres.headers);
        proxyres.pipe(res);
    });

    proxy.on('message', function(proxyres){
        console.log('proxy get 304');
        res.writeHead(304, proxyres.headers);
        res.end();
        //proxyres.pipe(res);
    });

    proxy.on('error', function(err){
        console.log("Error", err.message);
        res.end(JSON.stringify(err));
    });

    proxy.request({
        host: config.proxyDic.report.host,
        path: req.originalUrl.slice(13),
        method: req.method,
        port: config.proxyDic.report.port,
        headers: req.headers
    }, req.body);
});

router.use("/", function(req, res){
    var proxy = new MyProxy();
    proxy.request({
        host: config.proxyDic.rest.host,
        path: req.originalUrl.slice(6),
        method: req.method,
        port: config.proxyDic.rest.port,
        headers: req.headers
    }, req.body);

    proxy.on('response', function(proxyres){
        res.writeHead(200, proxyres.headers);
        proxyres.pipe(res);
    });

    proxy.on('error', function(err){
        console.log("Error", err.message);
        res.end(JSON.stringify(err));
    });
});

module.exports = router;
