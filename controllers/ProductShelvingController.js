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
            await search(req, res, 'ready for shelving')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

// Update Products in Shelf
const updateProductInShelf = async (req, res) => {

      try {
            const { id } = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Product Id incorrect`
                  })
            }

            let readyForShelvingProduct = await ProductShelvingModel.findById(id)
            const quantity = readyForShelvingProduct.inShelf.reduce((a, c) => a + c.quantity, 0) + req.body.quantity
            const receivedQuantity = readyForShelvingProduct.receivedQuantity

            if (quantity > receivedQuantity) {
                  return res.status(400).json({
                        status: false,
                        message: `Input Quantity and Shelf Quantity Exceed the received quantity.`
                  })
            }
            else if (quantity < receivedQuantity) {
                  readyForShelvingProduct.inShelf.push(req.body)
                  readyForShelvingProduct.status = 'partially in shelf'
            }
            else {
                  readyForShelvingProduct.inShelf.push(req.body)
                  readyForShelvingProduct.status = 'in shelf'
            }

            await readyForShelvingProduct.save()

            return res.status(201).send(
                  {
                        status: true,
                        message: "Assigned to shelf",
                        readyForShelvingProduct,
                  })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

//  Get Partially in Shelf Products
const getPartiallyInShelf = async (req, res) => {
      try {
            await search(req, res, 'partially in shelf')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

// Get in shelf products
const getInShelf = async (req, res) => {
      try {
            await search(req, res, 'in shelf')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const search = async (req, res, status) => {
      console.log(req.query);
      let filter = {
            status
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

module.exports = {
      assignToReadyForShelving,
      getReadyForShelving,
      updateProductInShelf,
      getPartiallyInShelf,
      getInShelf
}