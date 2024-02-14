const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      postSTOTracking,
      updateSTOTracking,
      getSTOTracking,
      getStoPendingForDN,
      getStoInDN,
      getStoInGRN,
      getStoInTransit
} = require('../controllers/STOTrackingController')

router.post('/', tokenVerify, postSTOTracking)
router.patch('/update', tokenVerify, updateSTOTracking)
router.get('/', tokenVerify, getSTOTracking)
router.get('/pending-for-dn', tokenVerify, getStoPendingForDN)
router.get('/in-dn', tokenVerify, getStoInDN)
router.get('/in-transit', tokenVerify, getStoInTransit)
router.get('/in-grn', tokenVerify, getStoInGRN)

module.exports = router