var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var officersSchema = new Schema({
  lodge: String,
  title: String,
  chairs: [
    {title: String, name: String}
  ]
});

module.exports = Officers = mongoose.model('Officers', officersSchema);