const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      outlets
} = require('../controllers/OutletController')

router.get('/', tokenVerify, outlets)

module.exports = router