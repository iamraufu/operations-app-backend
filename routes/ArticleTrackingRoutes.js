const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      postArticleTracking,
      getAllArticleTracking,
      getArticleInDocument,
      getArticleInboundPicking,
      getArticleInboundPacking,
      getArticleInboundPicked,
      getArticleInboundPacked,
      updateArticleTracking,
      upsertArticleTracking,
      upsertArticleTrackingPacking
} = require('../controllers/ArticleTrackingController')

// router.post('/', tokenVerify, postArticleTracking)
router.post('/upsert', tokenVerify, upsertArticleTracking)
router.post('/upsert-packing', tokenVerify, upsertArticleTrackingPacking)
router.get('/', tokenVerify, getAllArticleTracking)
router.get('/in-document', tokenVerify, getArticleInDocument)
router.get('/inbound-picking', tokenVerify, getArticleInboundPicking)
router.get('/inbound-packing', tokenVerify, getArticleInboundPacking)
router.get('/inbound-picked', tokenVerify, getArticleInboundPicked)
router.get('/inbound-packed', tokenVerify, getArticleInboundPacked)
router.patch('/update', tokenVerify, updateArticleTracking)

module.exports = router