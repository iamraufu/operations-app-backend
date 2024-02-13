const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      POGRN,
      STOGRN
} = require('../controllers/GRNController')

router.post('/from-po/create', tokenVerify, POGRN)
router.post('/from-sto/create', tokenVerify, STOGRN)

module.exports = router