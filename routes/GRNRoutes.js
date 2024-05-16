const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      POGRN,
      STOGRN,
      TPN
} = require('../controllers/GRNController')

router.post('/from-po/create', tokenVerify, POGRN)
router.post('/from-sto/create', tokenVerify, STOGRN)
router.post('/tpn', tokenVerify, TPN)

module.exports = router