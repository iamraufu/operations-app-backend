const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      postSTOTracking,
      updateSTOTracking,
      getSTOTracking,
      getStoPendingForDN,
      getStoInDN,
      getStoAssigned,
      getStoInboundPicking,
      getStoInboundPacking,
      getStoInboundPicked,
      getStoInboundPacked,
      getStoInGRN,
      getStoInTransit,
      getAllSTOTracking
} = require('../controllers/STOTrackingController')

router.post('/', tokenVerify, postSTOTracking)
router.patch('/update', tokenVerify, updateSTOTracking)
router.get('/', tokenVerify, getSTOTracking)
router.post('/all', tokenVerify, getAllSTOTracking)
router.get('/pending-for-dn', tokenVerify, getStoPendingForDN)
router.get('/in-dn', tokenVerify, getStoInDN)
router.get('/assigned', tokenVerify, getStoAssigned)
router.get('/inbound-picking', tokenVerify, getStoInboundPicking)
router.get('/inbound-packing', tokenVerify, getStoInboundPacking)
router.get('/inbound-picked', tokenVerify, getStoInboundPicked)
router.get('/inbound-packed', tokenVerify, getStoInboundPacked)
router.get('/in-transit', tokenVerify, getStoInTransit)
router.get('/in-grn', tokenVerify, getStoInGRN)

module.exports = router