const express = require('express')
const api = express.Router()
const testingControllers= require('../controllers/cliente')

api.get('/',testingControllers.testing )

module.exports = api;