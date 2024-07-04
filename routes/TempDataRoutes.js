const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      addTempData,
      getAllTempData,
      updateTempData,
      deleteTempData,
      createOrUpdateTempData,
      getAllTempDataByPost
} = require('../controllers/TempDataController')

router.post('/', tokenVerify, addTempData)
router.get('/', tokenVerify, getAllTempData)
router.patch('/:id', tokenVerify, updateTempData)
router.delete('/:id', tokenVerify, deleteTempData)

router.post('/upsert', tokenVerify, createOrUpdateTempData)
router.post('/getall', tokenVerify, getAllTempDataByPost)


module.exports = router