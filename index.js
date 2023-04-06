require("dotenv").config()
const express = require('express')
const bodyparser = require('body-parser')
const { connection } = require('./dataBase/connection')
const cors = require("cors")

const cliente_router = require('./routes/cliente')
const colaborador_router= require('./routes/colaborador')

// Conecion DB
connection();

// Crear Servidor de node
const app = express();
const port = process.env.PORT || 3000

// Convierte los cuerpos de las solicitudes en objetos JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// Permite solicitudes desde cualquier origen
app.use(cors())

//Rutas

app.use('/api',cliente_router )
app.use('/api',colaborador_router)

app.listen(port, () => {
  console.log("Servidor corriendo en el puerto" + ' ' + port)
})