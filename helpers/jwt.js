const jwt = require('jwt-simple');
const moment = require('moment');

exports.createToken = function (colaborador) {
  const payload = {
    sub: colaborador._id,
    nombres: colaborador.nombre,
    apellidos: colaborador.apellido,
    email: colaborador.email,
    rol: colaborador.rol,
    iat: moment().unix(),
    exp: moment().add(1, 'day').unix()
  }

  return jwt.encode(payload, process.env.JWRSECRET)
}