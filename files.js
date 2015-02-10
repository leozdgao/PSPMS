module.exports = {
	js: [
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
		"app/test/lib/angular-mocks.js",
		"app/test/**/*.js"
	],
	vendor: [
		"assets/lib/angular.min.js",
		"assets/lib/*.js"
	],
	css: [],
	templatesrc: "app/src/**/*.html",
	templatedest: "assets/template/",
	destJs: 'script.js',
	destCss: 'style.css',
	destLib: 'assets/release',
	release: 'assets/release'
}