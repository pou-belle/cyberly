
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FingerprintSchema = new Schema({
    filename: String,
    md5: String,
    uuid: String // unique user id, created by some unique method in the client (mac address)
});

module.exports = mongoose.model('Fingerprint', FingerprintSchema);