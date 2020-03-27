var mongoose = require("mongoose");

var uploadSchema = new mongoose.Schema({
   name: String,
   url: String,
   description: String,
   owner: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Upload", uploadSchema);