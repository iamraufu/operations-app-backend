const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const { stoDisplay } = require('../controllers/STOController')

router.post('/display', tokenVerify, stoDisplay)

module.exports = router