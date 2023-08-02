const Colaborador = require('../models/colaborador')
const Roles = require('../models/roles')
const jwt = require('jsonwebtoken');


const register_user = async (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const { email, password, roles, nombre, estado, apellido } = req.body;
  try {
    const encryptedPassword = await Colaborador.encryptPassword(password);

    const newUser = new Colaborador({
      nombre,
      apellido,
      email,
      estado,
      password: encryptedPassword,
    });

    if (roles) {
      const foundRoles = await Roles.find({ name: { $in: roles } });

      newUser.roles = foundRoles.map(role => role._id);
    } else {
      const role = await Roles.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    const saveUser = await newUser.save();

    const tokenPayload = {
      id: saveUser._id,
      nombre: saveUser.nombre,
      apellido: saveUser.apellido,
      email: saveUser.email,
      estado: saveUser.estado,
      roles: saveUser.roles
    };

    const token = jwt.sign(tokenPayload, process.env.JWRSECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};


const login = async (req, res) => {

  try {
    const user = await Colaborador.findOne({ email: req.body.email }).populate('roles')

    if (!user) {
      return res.status(400).json({ menssage: 'User not found' })
    }

    const matchPassword = await Colaborador.comparePassword(req.body.password, user.password)
    if (!matchPassword) {
      return res.status(400).json({ token: null, menssage: 'Invalid password' })
    }

    const tokenPayload = {
      id: user._id.toString(),
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      estado: user.estado,
      roles: user.roles,
    };

    const token = jwt.sign(tokenPayload, process.env.JWRSECRET, {
      expiresIn: 86400
    })

    const userInfo = {
      token,
      usuario: {
        id: user._id.toString(),
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        estado: user.estado,
        roles: user.roles,
      }
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesion' });
    console.log(error)
  }

};




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
  register_user,
  login,

  listar_colaboradores_admin,
  obtener_colaborador_admin,
  editar_colaborador_admin,
  cambiar_estado_colaborador_admin
}
