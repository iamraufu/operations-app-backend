const ProductShelvingModel = require('../models/ProductShelvingModel')
const mongoose = require('mongoose')

// Assign a product to ready for shelving
const assignToReadyForShelving = async (req, res) => {
      try {
            const data = await ProductShelvingModel.create(req.body)

            return res.status(201).send({
                  status: true,
                  message: `Material ${req.body.code} is ready for shelving`,
                  data
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

// Get ready for shelving products
const getReadyForShelving = async (req, res) => {
      try {
            console.log(req.query);
            let filter = {
                  status: "ready for shelving"
            };
            if (req.query.filterBy && req.query.value) {
                  filter[req.query.filterBy] = req.query.value;
            }

            console.log(filter);
            const pageSize = +req.query.pageSize || 10;
            const currentPage = +req.query.currentPage || 1;
            const sortBy = req.query.sortBy || '_id'; // _id or description or code or po or etc.
            const sortOrder = req.query.sortOrder || 'desc'; // asc or desc
            console.log(sortBy);

            const totalItems = await ProductShelvingModel.find(filter).countDocuments();
            const items = await ProductShelvingModel.find(filter)
                  .skip((pageSize * (currentPage - 1)))
                  .limit(pageSize)
                  .sort({ [sortBy]: sortOrder })
                  .exec();

            const responseObject = {
                  items,
                  totalPages: Math.ceil(totalItems / pageSize),
                  totalItems
            };
            return res.status(200).json(responseObject);
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const updateProductInShelf = async (req, res) => {

      try {
            const { id } = req.params
            let productDetails = {}

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Product Id incorrect`
                  })
            }

            const readyForShelvingProduct = await ProductShelvingModel.findById(id)
            const quantity = readyForShelvingProduct.inShelf.reduce((a, c) => a + c.quantity, 0) + req.body.quantity
            const receivedQuantity = readyForShelvingProduct.receivedQuantity
            
            if (quantity > receivedQuantity) {
                  return res.status(400).json({
                        status: false,
                        message: `Input Quantity and Shelf Quantity Exceed the received quantity.`
                  })
            }
            else if(quantity < receivedQuantity) {

            }
            else {

            }
            
            return res.status(201).send(
                  {
                        status: true,
                        REQ_BODY: req.body,
                        item
                  })

      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

module.exports = {
      assignToReadyForShelving,
      getReadyForShelving,
      updateProductInShelf
}