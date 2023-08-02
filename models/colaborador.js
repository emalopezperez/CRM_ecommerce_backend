const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const ColaboradorScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: false,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      trim: true
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
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

ColaboradorScheme.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

ColaboradorScheme.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
}

module.exports = mongoose.model("colaborador", ColaboradorScheme)