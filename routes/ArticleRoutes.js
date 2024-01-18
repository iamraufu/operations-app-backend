const express = require('express')
const router = express.Router()

// const { tokenVerify } = require('../utilities/tokenVerify')

const {
      products,
      singleProduct
} = require('../controllers/ArticleController')

router.get('/', products)
router.get('/:material', singleProduct)

module.exports = router