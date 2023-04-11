const Producto = require('../models/producto');
const Variedad = require('../models/variedad');
const slugify = require('slugify')
const fs = require('fs')
const path = require('path');


const registro_producto_admin = async function (req, res) {
  if (req.user) {
    let data = req.body;
    let productos = await Producto.find({ titulo: data.titulo });

    if (productos.length >= 1) {
      res.status(401).send({ data: undefined, message: 'El titulo del producto ya existe.' });
    } else {
      //REGISTRO PRODUCTO
      const img_path = req.files.portada.path
      const str_img = img_path.split('\\')
      const str_portada = str_img[2]

      data.portada = str_portada
      data.slug = slugify(data.titulo)

      try {
        let producto = await Producto.create(data);
        res.status(200).send({ data: producto, message: 'Productos subidos' })
      } catch (error) {
        res.status(400).send({ data: undefined, message: messages.join(', ') });
      }
    }
  } else {
    res.status(500).send({ data: undefined, message: 'Ocurrió un error al registrar el producto.' });
  }
}

const listar_productos_admin = async (req, res) => {
  if (req.user) {
    let filtro = req.params['filtro'];

    let productos = await Producto.find({
      $or: [
        { titulo: new RegExp(filtro, 'i') },
        { categoria: new RegExp(filtro, 'i') },
      ]
    });
    res.status(200).send({ message: "Lista de productos", productos })
  } else {
    res.status(401).send({ data: undefined, message: "No se puede encontrar el producto" })
  }
}

const obtener_portada_producto = async (req, res) => {
  // Obtenemos el nombre de la imagen de portada del producto a través del parámetro 'img' de la solicitud
  let img = req.params['img'];

  // Utilizamos el método 'fs.stat' para verificar si la imagen existe en la carpeta 'uploads/productos/'
  fs.stat('./uploads/productos/' + img, function (err) {
    if (err) {
      // Si la imagen no existe, establecemos la ruta de una imagen predeterminada como portada
      let path_img = './uploads/default.jpg';
      // Enviamos la imagen predeterminada como respuesta con un estado HTTP 200
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      // Si la imagen existe, establecemos la ruta de la imagen correspondiente como portada
      let path_img = './uploads/productos/' + img;
      // Enviamos la imagen correspondiente como respuesta con un estado HTTP 200
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
}

const obtener_producto_admin = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];

    try {
      let producto = await Producto.findById({ _id: id });
      res.status(200).send({ data: producto })
    } catch (error) {
      res.status(401).send({ msg: 'error' })
    }

  } else {
    res.status(401).send({ msg: 'error' })
  }
}

const editar_producto_admin = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('No se ha iniciado sesión');
    }

    const data = req.body;
    const id = req.params['id'];

    const productoExistente = await Producto.findOne({ titulo: data.titulo });
    if (productoExistente && productoExistente._id.toString() !== id) {
      throw new Error('El titulo del producto ya existe.');
    }

    let producto = await Producto.findOneAndUpdate({ _id: id }, {
      titulo: data.titulo,
      categoria: data.categoria,
      precio: data.precio,
      estado: data.estado,
      descuento: data.descuento,
      str_variedad: data.str_variedad,
      descripcion: data.descripcion,
    }, { new: true, runValidators: true });

    if (req.files && req.files.portada && req.files.portada.path) {
      const img_path = req.files.portada.path;
      const str_img = img_path.split('\\');
      const str_portada = str_img[2];
      producto.portada = str_portada;
      await producto.save();
    }

    res.status(200).send({ data: producto, message: 'Producto actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(400).send({ data: undefined, message: error.message });
  }
};

const registro_variedad_producto = async (req, res) => {
  if (req.user) {
    let data = req.body

    console.log(data)
    try {
      let variedad = await Variedad.create(data)
      res.status(200).send({ data: variedad })

    } catch (error) {
      console.error(error);
      res.status(400).send({ data: undefined, message: error.message });
    }

  } else {
    res.status(401).send({ msg: 'error' })
  }
}


const obtener_variedad_producto = async function (req, res) {
  if (req.user) {

    let id = req.params['id'];
    let variedades = await Variedad.find({ producto: id }).sort({ stock: -1 });
    res.status(200).send(variedades);

  } else {
    res.status(500).send({ data: undefined, message: 'ErrorToken' });
  }
}


const eliminar_variedad_producto = async function (req, res) {
  if (req.user) {

    let id = req.params['id'];

    let reg = await Variedad.findById({ _id: id });

    if (reg.stock == 0) {
      let variedad = await Variedad.findOneAndRemove({ _id: id });
      res.status(200).send(variedad);
    } else {
      res.status(200).send({ data: undefined, message: 'No se puede eliminar esta variedad' });
    }



  } else {
    res.status(500).send({ data: undefined, message: 'ErrorToken' });
  }
}



module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada_producto,
  obtener_producto_admin,
  editar_producto_admin,
  registro_variedad_producto,
  obtener_variedad_producto,
  eliminar_variedad_producto
}
