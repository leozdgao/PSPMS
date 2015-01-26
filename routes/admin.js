var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {

	var func = [
		{ info: "Manage Resources", icon: "icon-resources" }, 
		{ info: "Analyse Log", icon: "icon-document" }
	];

	res.render('admin', { isAdmin: true, func: func });
});

router.get('/resources', function(req, res) {


});

module.exports = router;
