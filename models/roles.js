const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const roleSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Role", roleSchema);
