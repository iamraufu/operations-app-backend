const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      poList,
      poReleased,
      poDisplay
} = require('../controllers/POController')

router.post('/list', tokenVerify, poList)
router.post('/released', tokenVerify, poReleased)
router.post('/display', tokenVerify, poDisplay)

module.exports = router