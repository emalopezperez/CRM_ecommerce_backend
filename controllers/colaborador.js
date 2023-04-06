const Colaborador = require('../models/colaborador')
const bcrypt = require('bcrypt-nodejs');

const registro_colaborador_admin = async (req, res) => {
  let data = req.body

  const { password } = data

  bcrypt.hash(password, null, null, (error, hash) => {
    if(error){
      res.status(200).send({data: undefined, mensage:" No se pudo encriptar la contrasena"})
    }else{
      console.log(hash)
    }
  })
}

module.exports = {
  registro_colaborador_admin
}
