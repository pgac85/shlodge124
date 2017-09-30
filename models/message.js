var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var messageSchema = new Schema({
    title: String,
    details: String,
    address: String,
    city: String,
    zipCode: String,
    type: String,
    postDate: {type: Date, default: Date.now},
    date: Date
});

module.exports = mongoose.model('Message', messageSchema);