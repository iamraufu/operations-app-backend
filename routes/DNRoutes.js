const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      createDN,
      dnDisplay
} = require('../controllers/DNController')

router.post('/create', tokenVerify, createDN)
router.post('/display', tokenVerify, dnDisplay)

module.exports = router