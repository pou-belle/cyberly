var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProgramFiles86Schema = new Schema({
    filename: String,
    md5: String,
    uuid: String,
    parentName: String
});

module.exports = mongoose.model('ProgramFiles86', ProgramFiles86Schema);