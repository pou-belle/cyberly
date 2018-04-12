var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var System32Schema = new Schema({
    filename: String,
    md5: String,
    uuid: String,
    parentName: String
});

module.exports = mongoose.model('System32', System32Schema);