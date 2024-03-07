const express = require('express')
const router = express.Router()

// const { tokenVerify } = require('../utilities/tokenVerify')

const {
      products,
      productByMC,
      singleProduct
} = require('../controllers/ArticleController')

router.get('/', products)
router.post('/', productByMC)
router.get('/:material', singleProduct)

module.exports = router