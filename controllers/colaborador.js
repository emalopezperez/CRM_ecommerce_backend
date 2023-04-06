const Colaborador = require('../models/colaborador')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt')

const registro_colaborador_admin = async (req, res) => {

  if (req.user) {
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
  } else {
    res.status(500).send({ data: undefined, mensage: " Error token" })
  }
}

const login_colaborador_admin = async (req, res) => {
  let data = req.body
  const colaboradores = await Colaborador.find({ email: data.email })

  if (colaboradores.length >= 1) {
    bcrypt.compare(data.password, colaboradores[0].password, (error, check) => {

      if (check) {
        res.status(200).send({
          token: jwt.createToken(colaboradores[0]),
          colaborador: colaboradores[0]
        })
      } else {
        res.status(200).send({ data: undefined, mensage: " Contrasena incorrecta" })
      }
    })
  } else {
    res.status(200).send({ data: undefined, mensage: " No se encontro el correo electronico" })
  }
}


const listar_colaboradores_admin = async (req, res) => {
  if (req.user) {

    let colaboradores = await Colaborador.find()
    res.status(200).send({msg:"lista de colaboradores" ,colaboradores})
  } else {
    res.status(200).send({ data: undefined, mensage: " no se puede acceder" })
  }
}

module.exports = {
  registro_colaborador_admin,
  login_colaborador_admin,
  listar_colaboradores_admin
}

