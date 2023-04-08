const Colaborador = require('../models/colaborador')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');

const registro_colaborador_admin = async (req, res) => {
  if (req.user) {
    let data = req.body
    let colaboradores = await Colaborador.find({ email: data.email })

    if (colaboradores.length >= 1) {
      res.status(409).send({ data: undefined, message: "El correo electrónico ya está registrado" })
    } else {
      bcrypt.hash('123456', null, null, async (error, hash) => {
        if (error) {
          res.status(500).send({ data: undefined, message: "No se pudo encriptar la contraseña" })
        } else {
          console.log(hash)
          data.password = hash; // actualiza el valor de data.password
          let colaborador = await Colaborador.create(data)

          res.status(201).send({ data: colaborador })
        }
      })
    }
  } else {
    res.status(401).send({ data: undefined, message: "Error de autenticación del token" })
  }
}

const login_colaborador_admin = async (req, res) => {
  let data = req.body
  const colaboradores = await Colaborador.find({ email: data.email })

  if (colaboradores.length >= 1) {
    if (colaboradores[0].estado) {
      bcrypt.compare(data.password, colaboradores[0].password, async function (err, check) {
        if (check) {
          res.status(200).send({
            token: jwt.createToken(colaboradores[0]),
            usuario: colaboradores[0]
          });
        } else {
          res.status(200).send({ data: undefined, message: 'La contraseña es incorrecta.' });
        }

      });
    } else {
      res.status(200).send({ data: undefined, message: 'Su cuenta esta desactivada.' });
    }
  } else {
    res.status(404).send({ data: undefined, message: "No se encontró el correo electrónico" })
  }
}

const listar_colaboradores_admin = async (req, res) => {
  if (req.user) {

    let filtro = req.params['filtro'];

    let colaboradores = await Colaborador.find({
      $or: [
        { nombres: new RegExp(filtro, 'i') },
        { apellidos: new RegExp(filtro, 'i') },
        { email: new RegExp(filtro, 'i') },
      ]
    });
    res.status(200).send({ message: "Lista de colaboradores", colaboradores })
  } else {
    res.status(401).send({ data: undefined, message: "No se puede acceder sin autenticación" })
  }
}

const obtener_colaborador_admin = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];

    try {
      let colaborador = await Colaborador.findById({ _id: id });
      res.status(200).send({ data: colaborador })
    } catch (error) {
      res.status(401).send({ msg: 'error' })
    }

  } else {
    res.status(401).send({ msg: 'error' })
  }
}

const editar_colaborador_admin = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];
    let data = req.body

    try {
      let colaborador_editado = await Colaborador.findByIdAndUpdate(id, {
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        email: data.email
      }, { new: true })

      res.status(200).send({ data: colaborador_editado })

    } catch (error) {
      res.status(401).send({ msg: 'error' })
    }

  } else {
    res.status(401).send({ msg: 'error' })
  }
}

const cambiar_estado_colaborador_admin = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];
    let data = req.body

    let nuevo_estado_colaborador = false

    if (data.estado) {
      nuevo_estado_colaborador = false
    } else {
      nuevo_estado_colaborador = true
    }

    try {
      let colaborador_nuevo_estado = await Colaborador.findByIdAndUpdate(id, {
        estado: nuevo_estado_colaborador,
      }, { new: true })

      res.status(200).send({ data: colaborador_nuevo_estado })

    } catch (error) {
      res.status(401).send({ msg: 'error' })
    }

  } else {
    res.status(401).send({ msg: 'error' })
  }
}

module.exports = {
  registro_colaborador_admin,
  login_colaborador_admin,
  listar_colaboradores_admin,
  obtener_colaborador_admin,
  editar_colaborador_admin,
  cambiar_estado_colaborador_admin
}
