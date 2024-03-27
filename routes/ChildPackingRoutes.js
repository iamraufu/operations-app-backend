const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      generateChildPackingList,
      getChildPackingList
} = require('../controllers/ChildPackingController')

router.post('/', tokenVerify, generateChildPackingList)
router.get('/', tokenVerify, getChildPackingList)

module.exports = router