const TPNModel = require('../models/TPNModel');
const mongoose = require('mongoose');

const postPendingForTPN = async (req, res) => {
      try {

            const tpn = await TPNModel.create(req.body)

            return res.status(201).send(
                  {
                        status: true,
                        message: "TPN data posted successfully!",
                        data: tpn
                  })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const getPendingForTPN = async (req, res) => {
      try {
            await search(req, res, '')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const updatePendingForTPN = async (req, res) => {
      try {

            const { id } = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `TPN Id incorrect`
                  })
            }

            const tpn = await TPNModel.findById(id)
            const tpnExist = Boolean(tpn)

            if (!tpnExist) {
                  return res.status(401).json({
                        status: false,
                        message: `TPN doesn't exist`,
                  });
            }

            let updatedTPN = await TPNModel.findByIdAndUpdate
                  (
                        id, req.body,
                        {
                              new: true,
                              runValidators: true
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "TPN updated successfully",
                  tpn: updatedTPN
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const search = async (req, res, status) => {

      let filter = {
            status
      };

      if (status === '') {
            filter = {};
      }

      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id'; // _id or description or code or po or etc.
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await TPNModel.find(filter).countDocuments();
      const items = await TPNModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .exec();

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
      postPendingForTPN,
      getPendingForTPN,
      updatePendingForTPN
}