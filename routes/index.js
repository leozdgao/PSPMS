var connect = require("connect");
var router = connect();

/* GET home page. */
router.use('/', function(req, res) {

	console.log(req.url);

	require("fs").createReadStream("views/index.html").pipe(res);
});

module.exports = router;
