const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      createGRN
} = require('../controllers/GRNController')

router.post('/create', tokenVerify, createGRN)

module.exports = router