var http = require('http'),
    EventEmitter = require('events').EventEmitter,
    util = require('util');

function MyProxy(){ EventEmitter.call(this); }
util.inherits(MyProxy, EventEmitter);
MyProxy.prototype.request = function(option, body){
    var req = http.request(option);
    var self = this;

    req.on("response", function(res){
        if(res.statusCode == 200) {
            self.emit('response', res);
        }
        else if(res.statusCode == 303){
            var buffer = new Buffer("");
            res.on("data", function(data){
                buffer = Buffer.concat([buffer, new Buffer(data)]);
            });
            res.on("end", function(){
                var redirectString = "Redirecting to ";
                var url = buffer.toString("utf8").slice(redirectString.length);
                option.path = url;

                self.request(option);
            });
        }
        else if(res.statusCode == 400){
            self.emit('error', new Error("400 not request."));
        }
    });

    req.on("error", function(e){
        self.emit('error', e);
    });

    if(body && Object.keys(body).length > 0){
        req.end(JSON.stringify(body));
    }
    else {
        req.end();
    }
}

module.exports = MyProxy;
