module.exports = {
	src: [
		"app/src/app.js",
		"app/src/admin/admin.js",
		"app/src/auth/auth.js",
		"app/src/data/restclient.js",
		"app/src/directives/directive.js",
		"app/src/directives/**/*.js",
		"app/src/filters/filter.js",
		"app/src/info/info.js",
		"app/src/info/**/*.js",
		"app/src/report/report.js",
		"app/src/report/**/*.js"
	],
	test: [
		"app/test/**/*.js"
	],
	vendor: [
		"app/public/javascripts/vendors/angular.min.js",
		"app/public/javascripts/vendors/*.js"
	]
}