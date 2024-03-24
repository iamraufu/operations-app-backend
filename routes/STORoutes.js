const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      stoDisplay,
      stoList,
      multipleStoList
} = require('../controllers/STOController')

router.post('/list', tokenVerify, stoList)
router.post('/display', tokenVerify, stoDisplay)
router.get('/list', tokenVerify, multipleStoList)

module.exports = router