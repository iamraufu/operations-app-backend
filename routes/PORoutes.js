const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      poDisplay
} = require('../controllers/POController')

router.post('/display', tokenVerify, poDisplay)

module.exports = router