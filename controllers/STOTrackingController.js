const STOTrackingModel = require('../models/STOTrackingModel');
const mongoose = require('mongoose');

const postSTOTracking = async (req, res) => {
      try {
            const { sto } = req.body
            const filter = {
                  sto
            }

            const isAlreadySTOInTracking = Boolean(await STOTrackingModel.findOne(filter))

            if (isAlreadySTOInTracking) {
                  return res.status(409).send({
                        status: false,
                        message: `${sto} has already been tracked`
                  })
            }
            else {
                  const data = await STOTrackingModel.create(req.body)

                  return res.status(201).send({
                        status: true,
                        message: `${sto} is ready for tracking`,
                        data
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

// const updateSTOTracking = async (req, res) => {
//       try {
//             const { id } = req.params

//             if (!mongoose.Types.ObjectId.isValid(id)) {
//                   return res.status(404).json({
//                         status: false,
//                         message: `STO id incorrect`
//                   })
//             }

//             let STOTracking = await STOTrackingModel.findById(id)

//             if(STOTracking === null){
//                   return res.status(404).json({
//                         status: false,
//                         message: `STO id incorrect`
//                   })
//             }
//             else if(STOTracking.picker.length > 0) {
//                   STOTracking.status = "in picking"
//             }

//             await STOTracking.save()

//             return res.status(201).send(
//                   {
//                         status: true,
//                         message: "Updated STO Tracking",
//                         stoInTracking: STOTracking
//                   })
//       }
//       catch (err) {
//             res.status(500).json({
//                   status: false,
//                   message: `${err}`
//             })
//       }
// }

const getSTOTracking = async (req, res) => {
      try {
            await search(req, res, '')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoPendingForDN = async (req, res) => {
      try {
            await search(req, res, 'pending for dn')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInDN = async (req, res) => {
      try {
            await search(req, res, 'in dn')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInGRN = async (req, res) => {
      try {
            await search(req, res, 'in grn')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInTransit = async (req, res) => {
      try {
            await search(req, res, 'in transit')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const search = async (req, res, status) => {

      let filter = {
            status
      };

      if(status === ''){
            filter = {};
      }

      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id'; // _id or description or code or po or etc.
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await STOTrackingModel.find(filter).countDocuments();
      const items = await STOTrackingModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .exec();

      const responseObject = {
            status: true,
            items,
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems
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
      postSTOTracking,
      // updateSTOTracking,
      getSTOTracking,
      getStoPendingForDN,
      getStoInDN,
      getStoInGRN,
      getStoInTransit
}