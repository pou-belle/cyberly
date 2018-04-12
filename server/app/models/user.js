var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
   
    uuid: String

   // unique user id, created by some unique method in the client (mac address)
});

module.exports = mongoose.model('User', UserSchema);