const mongoose = require('mongoose');

const connection = async () => {
  const DB_URL = process.env.DB_URL;
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log("Coneccion a la base de datos existosa")
  } catch (error) {
    console.log(error);
    throw new Error("No se ha podido conectar a la base de datos ")
  }
}

module.exports = {
  connection
}