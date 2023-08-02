require("dotenv").config()
const express = require('express')
const bodyparser = require('body-parser')
const { connection } = require('./dataBase/connection')
const cors = require("cors")
const { createRoles } = require('./libs/initialSetup')

const cliente_router = require('./routes/cliente')
const colaborador_router = require('./routes/colaborador')
const producto_router = require('./routes/producto')
const cookieParser = require('cookie-parser');

// Conecion DB
connection();
createRoles();

// Crear Servidor de node
const app = express();
const port =  3000
app.use(cookieParser());

// Convierte los cuerpos de las solicitudes en objetos JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

app.use(cors())

//Rutas

app.use('/api', cliente_router)
app.use('/api', colaborador_router)
app.use('/api', producto_router)

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000")
})