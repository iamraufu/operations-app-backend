const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const { createDN } = require('../controllers/DNController')

router.post('/create',tokenVerify, createDN)

module.exports = router