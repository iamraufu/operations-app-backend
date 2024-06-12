const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      addTempData,
      getAllTempData,
      updateTempData,
      deleteTempData
} = require('../controllers/TempDataController')

router.post('/', tokenVerify, addTempData)
router.get('/', tokenVerify, getAllTempData)
router.patch('/:id', tokenVerify, updateTempData)
router.delete('/:id', tokenVerify, deleteTempData)

module.exports = router