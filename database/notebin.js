const mongoose = require("mongoose")
const NoteBin = mongoose.Schema({
  ID: String,
  views: Number,
  note: String,
  created: Number
})
module.exports = mongoose.model('notebins', NoteBin)