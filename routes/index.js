var connect = require("connect");
var router = connect();

/* GET home page. */
router.use('/', function(req, res) {

	console.log(req.url);

	require("fs").createReadStream("assets/index.html").pipe(res);
});

module.exports = router;
