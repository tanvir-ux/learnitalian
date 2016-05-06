// Initialise "Word" schema as Model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

// Define "Word" object schema
var wordSchema = mongoose.Schema({
	eng: String,
	esp: String,
	type: String,
	date_created: { type: Date, default: Date.now },
	revision_list: Boolean,
});

// Enable simple-random middleware
wordSchema.plugin(random);

module.exports = mongoose.model('Word', wordSchema);