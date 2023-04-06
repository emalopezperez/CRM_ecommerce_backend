const mongoose = require("mongoose")

const ColaboradorScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true
    },
    apellido: {
      type: String,
      require: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      require: true,
      lowercase: true,
      trim: true
    },
    rol: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      trim: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = mongoose.model("colaborador", ColaboradorScheme)