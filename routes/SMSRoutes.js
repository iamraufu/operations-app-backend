const express = require('express')
const router = express.Router()

// const { tokenVerify } = require('../utilities/tokenVerify')

const {
      sendSMS,
      updateSMS
} = require('../controllers/SMSController')

router.post('/', sendSMS)
router.patch('/', updateSMS)

module.exports = router