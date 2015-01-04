var express = require("express");
var router = express.Router();

router.post("/login", function(req, res) {
	var body = req.body;
	var uid = body.uid;
	var pwd = body.pwd;

	if(uid && pwd) {

	}
	else {
		res.json({ success: 0, msg: "uid or pwd can't be empty." });
	}
});

router.get("/logout", function(req, res) {
	var token = req.params.token
	if(typeof token != "undefined") {

	}
	else {
		res.json({ success: 0, msg: "Can't logout without token." });
	}
});

module.exports = router;
