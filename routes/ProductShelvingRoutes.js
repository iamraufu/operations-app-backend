const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      assignToReadyForShelving,
      getReadyForShelving,
      updateProductInShelf
} = require('../controllers/ProductShelvingController')

router.post('/ready', tokenVerify, assignToReadyForShelving)
router.get('/ready', tokenVerify, getReadyForShelving)
router.post('/in-shelf/:id', tokenVerify, updateProductInShelf)

module.exports = router