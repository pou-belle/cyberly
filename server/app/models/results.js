
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultsSchema = new Schema({

    uuid: String,
    parentName: String 
});

module.exports = mongoose.model('Results', ResultsSchema);