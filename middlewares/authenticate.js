const jwt = require('jwt-simple');

exports.decodeToken = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "no headers error" })
  }

  let token = req.headers.authorization;
  let segment = token.split('.');

  if (segment.length != 3) {
    return res.status(403).send({ message: 'InvalidToken' });
  } else {
    try {
      var payload = jwt.decode(token, process.env.JWRSECRET);
      console.log(payload);
    } catch (error) {
      return res.status(403).send({ message: 'ErrorToken' });
    }
  }

  req.user = payload;
  next();
}