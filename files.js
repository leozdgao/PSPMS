module.exports = {
	lib: [
		"node_modules/angular/angular.min.js",
		"node_modules/angular/angular.min.js.map",
		"node_modules/angular-bootstrap/dist/ui-bootstrap.min.js",
		"node_modules/angular-cookies/angular-cookies.min.js",
		"node_modules/angular-cookies/angular-cookies.min.js.map",
		"node_modules/angular-messages/angular-messages.min.js",
		"node_modules/angular-messages/angular-messages.min.js.map",
		"node_modules/angular-resource/angular-resource.min.js",
		"node_modules/angular-resource/angular-resource.min.js.map",
		"node_modules/angular-ui-router/release/angular-ui-router.min.js",
		"node_modules/bootstrap/dist/css/bootstrap.min.css",
		"node_modules/bootstrap/dist/css/bootstrap.css.map"
	],
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
		"app/src/global.css",
		"app/src/submodules/**/*.css"
	],
	monignore: [
		'app/**/*.js'
	],
	templatesrc: "app/src/**/*.html",
	templatedest: "assets/template/",
	destJs: 'script.js',
	destCss: 'style.css',
	destLib: 'assets/release',
	release: 'assets/release',
	librealse: 'assets/lib'
}