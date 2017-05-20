var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var System32Schema = new Schema({
    filename: String,
    md5: String,
    uuid: String // unique user id, created by some unique method in the client (for example mac address)
});

module.exports = mongoose.model('System32', System32Schema);