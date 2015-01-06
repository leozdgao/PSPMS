var express = require("express");
var router = express.Router();

// code:
// - 0  success
// - 1  wrong uid or pwd
// - 2  miss token

router.post("/login", function(req, res) {
	var body = req.body;
	var uid = body.uid;
	var pwd = body.pwd;

	if(uid && pwd) {

		if(uid == "admin" && pwd == "123") {
			res.status(200).json({ code: 0, msg: "Login successfully.", user: { name: "admin", role: 1, token: "123456" } });
		}
		else {
			res.status(401).json({ code: 1, msg: "uid or pwd is wrong" });
		}

	}
	else {
		res.status(401).json({ code: 1, msg: "uid or pwd can't be empty." });
	}
});

router.get("/logout", function(req, res) {
	var token = req.param("token");
	console.log(token);
	if(typeof token != "undefined") {
		res.status(200).json({ code: 0, msg: "Logout successfully." })
	}
	else {
		res.status(400).json({ code: 2, msg: "Can't logout without token." });
	}
});

module.exports = router;
