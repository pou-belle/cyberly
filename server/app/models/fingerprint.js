
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FingerprintSchema = new Schema({
    filename: String,
    md5: String,
    uuid: String,
    parentName: String
});

module.exports = mongoose.model('Fingerprint', FingerprintSchema);