const Colaborador = require('../models/colaborador')
const bcrypt = require('bcrypt-nodejs');

const registro_colaborador_admin = async (req, res) => {
  let data = req.body
  let colaboradores = await Colaborador.find({ email: data.email })

  if (colaboradores.length >= 1) {
    res.status(200).send({ data: undefined, mensage: " El correo electronico ya esta registrado" })
  } else {
    bcrypt.hash('123456', null, null, async (error, hash) => {
      if (error) {
        res.status(200).send({ data: undefined, mensage: " No se pudo encriptar la contrasena" })
      } else {
        console.log(hash)
        data.password = hash; // actualiza el valor de data.password
        let colaborador = await Colaborador.create(data)

        res.status(200).send({ data: colaborador })
      }
    })
  }

}

module.exports = {
  registro_colaborador_admin
}

