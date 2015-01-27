module.exports = {
	js: [
		'src/js/*.js'
	],
	css: [
		'src/css/global.css',
		'src/css/*.css'
	],
	watch: [
		'assets/script.min.js',
		'assets/style.min.css',
		'views/**/*.hbs'
	],
	monignore: [
		'assets/*',
		'src/*',
		'views/*'
	]
}