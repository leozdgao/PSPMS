var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: { type: String },
	password: { type: String },
	salt: { type: String },
	role: { type: Number }
});

var sessionSchema = new Schema({
	token: { type: String },
	name: { type: String },
	role: { type: Number },
	expire: { type: Number }
});

module.exports = {
	User: mongoose.model("User", userSchema),
	Session: mongoose.model("Session", sessionSchema)
}