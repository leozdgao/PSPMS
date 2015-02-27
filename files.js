module.exports = {
	js: [
		"app/src/app.js",
		"app/src/auth/auth.js",
		"app/src/data/restclient.js",
		"app/src/directives/directive.js",
		"app/src/directives/**/*.js",
		"app/src/filters/filter.js",
		"app/src/submodules/admin/admin.js",
		"app/src/submodules/admin/**/*.js",
		"app/src/submodules/info/info.js",
		"app/src/submodules/info/**/*.js",
		"app/src/submodules/report/report.js",
		"app/src/submodules/report/**/*.js"
	],
	test: [
		"app/test/lib/angular-mocks.js",
		"app/test/**/*.js"
	],
	vendor: [
		"assets/lib/angular.min.js",
		"assets/lib/*.js"
	],
	css: [
		"app/src/global.css"
	],
	monignore: [
		'app/**/*.js'
	],
	templatesrc: "app/src/**/*.html",
	templatedest: "assets/template/",
	destJs: 'script.js',
	destCss: 'style.css',
	destLib: 'assets/release',
	release: 'assets/release'
}