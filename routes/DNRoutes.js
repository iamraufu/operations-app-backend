const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      createDN,
      dnDisplay,
      dnUpdate
} = require('../controllers/DNController')

router.post('/create', tokenVerify, createDN)
router.post('/display', tokenVerify, dnDisplay)
router.post('/update', tokenVerify, dnUpdate)

module.exports = router