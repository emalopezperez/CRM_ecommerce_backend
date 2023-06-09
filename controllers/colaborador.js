const Colaborador = require('../models/colaborador')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');

const registro_colaborador_admin = async (req, res) => {
  if (req.user) {
    let data = req.body
    let colaboradores = await Colaborador.find({ email: data.email })

    if (colaboradores.length >= 1) {
      res.status(400).send({ data: undefined, message: "Error, el correo electrónico ya está registrado" })
    } else {
      bcrypt.hash('123456', null, null, async (error, hash) => {
        if (error) {
          res.status(500).send({ data: undefined, message: "No se pudo encriptar la contraseña" })
        } else {
          console.log(hash)
          data.password = hash; // actualiza el valor de data.password
          let colaborador = await Colaborador.create(data)

          res.status(201).send({ data: colaborador , message: "Colaborador registrado correctamente" })
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
            usuario: colaboradores[0],
            menssage: "Logeado correctamente"
          });
        } else {
          res.status(400).send({ data: undefined, message: 'La contraseña es incorrecta.' });
        }
      });
    } else {
      res.status(400).send({ data: undefined, message: 'Su cuenta esta desactivada.' });
    }
  }
  else {
    res.status(400).send({ data: undefined, message: "No se encontró el correo electrónico" })
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
    res.status(200).send({ colaboradores })
  } else {
    res.status(401).send({ data: undefined, message: "No se puede acceder sin autenticación" })
  }
}

const obtener_colaborador_admin = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];

    try {
      let colaborador = await Colaborador.findById({ _id: id });
      res.status(200).send({ colaborador })
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
    let data = req.body;
    let updateFields = {}; // objeto vacío para agregar dinámicamente los campos que se desean actualizar

    if (data.nombre) {
      updateFields.nombre = data.nombre;
    }

    if (data.apellido) {
      updateFields.apellido = data.apellido;
    }

    if (data.rol) {
      updateFields.rol = data.rol;
    }

    if (data.email) {
      updateFields.email = data.email;
    }

    try {
      let colaborador_editado = await Colaborador.findByIdAndUpdate(id, {
        $set: updateFields
      }, { new: true });

      res.status(200).send({ data: colaborador_editado });

    } catch (error) {
      res.status(401).send({ msg: 'error' });
    }

  } else {
    res.status(401).send({ msg: 'error' });
  }
};


const cambiar_estado_colaborador_admin = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];
    let data = req.body;

    let nuevo_estado_colaborador = data.estado;

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
