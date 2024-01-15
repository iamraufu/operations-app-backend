const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      products
} = require('../controllers/ArticleController')

router.get('/', tokenVerify, products)

module.exports = router