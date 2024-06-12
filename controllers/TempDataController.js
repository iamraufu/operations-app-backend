
const TempDataModel = require('../models/TempDataModel');
const mongoose = require("mongoose");

const addTempData = async (req, res) => {
      try {

            const { userId } = req.body

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                  return res.status(404).json({
                        status: false,
                        message: `User Id incorrect`
                  })
            }

            const tempData = await TempDataModel.create(req.body)

            await res.status(201).json({
                  status: true,
                  message: "Added to Temp Data",
                  tempData
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const getAllTempData = async (req, res) => {
      try {
            await search(req, res)
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const updateTempData = async (req, res) => {
      try {
            const { id } = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `TempData Id incorrect`
                  })
            }

            const tempData = await TempDataModel.findById(id)
            const tempDataExist = Boolean(tempData)

            if (!tempDataExist) {
                  return res.status(401).json({
                        status: false,
                        message: `TempData doesn't exist with this Id`,
                  });
            }

            let updatedTempData = await TempDataModel.findByIdAndUpdate
                  (
                        id, req.body,
                        {
                              new: true,
                              runValidators: true
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "TempData updated successfully",
                  tempData: updatedTempData
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const deleteTempData = async (req, res) => {
      try {

            const { id } = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `TempData Id incorrect`
                  })
            }

            const tempData = await TempDataModel.findById(id)
            const tempDataExist = Boolean(tempData)

            if (!tempDataExist) {
                  return res.status(401).json({
                        status: false,
                        message: `TempData doesn't exist with this Id`,
                  });
            }

            await TempDataModel.findByIdAndDelete(id);

            res.status(200).json({
                  status: true,
                  message: 'TempData deleted successfully'
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const search = async (req, res) => {

      let filter = {};

      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id'; // _id or description or code or po or etc.
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await TempDataModel.find(filter).countDocuments();
      const items = await TempDataModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })


      const responseObject = {
            status: true,
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            items
      };

      if (items.length) {
            return res.status(200).json(responseObject);
      }

      else {
            return res.status(401).json({
                  status: false,
                  message: "Nothing found",
                  items
            });
      }
}

module.exports = {
      addTempData,
      getAllTempData,
      updateTempData,
      deleteTempData
}