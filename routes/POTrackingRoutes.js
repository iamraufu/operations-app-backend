const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      postPOTracking,
      updatePOTracking,
      getPOTracking,
      getPoPendingForGRN,
      getPoInGRN
} = require('../controllers/POTrackingController')

router.post('/', tokenVerify, postPOTracking)
router.patch('/', tokenVerify, updatePOTracking)
router.get('/', tokenVerify, getPOTracking)
router.get('/pending-for-grn', tokenVerify, getPoPendingForGRN)
router.get('/in-grn', tokenVerify, getPoInGRN)

module.exports = router