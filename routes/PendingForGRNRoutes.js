const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      pendingPOForGRN,
      updatePendingPOForGRN,
      getPendingPOForGRN,
} = require('../controllers/GRNController')

router.post('/pending-for-grn', tokenVerify, pendingPOForGRN)
router.patch('/pending-for-grn/:id', tokenVerify, updatePendingPOForGRN)
router.get('/pending-for-grn', tokenVerify, getPendingPOForGRN)

module.exports = router