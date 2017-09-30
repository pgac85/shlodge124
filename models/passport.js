var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var passportSchema = new Schema({
    name: String,
    pass: String,
    salt: String
});

module.exports = mongoose.model('Passport', passportSchema);