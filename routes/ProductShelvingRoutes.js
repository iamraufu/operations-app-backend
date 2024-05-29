const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      assignToReadyForShelving,
      getReadyForShelving,
      updateProductInShelf,
      getPartiallyInShelf,
      getInShelf,
      getAllData
} = require('../controllers/ProductShelvingController')

router.post('/ready', tokenVerify, assignToReadyForShelving)
router.get('/', tokenVerify, getAllData)
router.get('/ready', tokenVerify, getReadyForShelving)
router.post('/in-shelf/:id', tokenVerify, updateProductInShelf)
router.get('/partially-in-shelf', tokenVerify, getPartiallyInShelf)
router.get('/in-shelf', tokenVerify, getInShelf)

module.exports = router