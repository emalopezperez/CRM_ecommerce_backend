const mongoose = require("mongoose")

const ColaboradorScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    rol: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    estado: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
)

module.exports = mongoose.model("colaborador", ColaboradorScheme)