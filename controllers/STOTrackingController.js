const STOTrackingModel = require('../models/STOTrackingModel');

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

const updateSTOTracking = async (req, res) => {
      try {
            const {
                  sto,
                  picker,
                  pickerId,
                  packer,
                  packerId,
                  pickingStartingTime,
                  pickingEndingTime,
                  packingStartingTime,
                  packingEndingTime,
                  pickedSku,
                  status
            } = req.body

            // console.log("REQ_BODY: ", req.body);

            const filter = {
                  sto
            }

            let STOTracking = await STOTrackingModel.findOne(filter)

            if (STOTracking === null) {
                  return res.status(404).json({
                        status: false,
                        message: `STO id incorrect`
                  })
            }

            // const {
            //       picker: hasPicker,
            //       packer: hasPacker,
            //       pickingStartingTime: hasPickingStartingTime,
            //       pickingEndingTime: hasPickingEndingTime,
            //       packingStartingTime: hasPackingStartingTime,
            //       packingEndingTime: hasPackingEndingTime
            // } = STOTracking

            // console.log("FROM DB: ", hasPicker,
            //       hasPacker,
            //       hasPickingStartingTime,
            //       hasPickingEndingTime,
            //       hasPackingStartingTime,
            //       hasPackingEndingTime);

            // const hasBothPickerAndPickingStartingTime = hasPicker && hasPickingStartingTime
            // const doesNotHavePicker = !hasPicker
            // const hasBothPackerAndPackerStartingTime = hasPacker && hasPackingStartingTime
            // const doesNotHavePacker = !hasPacker
            // const hasAllPickerInfo = hasPicker && hasPickingStartingTime && hasPickingEndingTime
            // const hasAllPackerInfo = hasPacker && hasPackingStartingTime && hasPackingEndingTime

            // console.log({
            //       hasBothPickerAndPickingStartingTime, doesNotHavePicker, hasBothPackerAndPackerStartingTime, doesNotHavePacker, hasAllPickerInfo, hasAllPackerInfo
            // });

            // if (hasPicker && hasPickingStartingTime) {
            //       console.log("Inbound Picking ", hasPicker, hasPickingStartingTime, pickingStartingTime);
            //       STOTracking.status = "inbound picking"
            //       STOTracking.pickingStartingTime = pickingStartingTime || new Date()
            // }
            // else if (!hasPicker) {
            //       if (!picker && !pickerId) {
            //             throw new Error('Picker & Picker Id is required')
            //       }
            //       STOTracking.picker = picker
            //       STOTracking.pickerId = pickerId
            //       STOTracking.status = "task assigned"
            // }
            // else if (hasPacker && hasPackingStartingTime) {
            //       STOTracking.status = "inbound packing"
            //       STOTracking.packingStartingTime = packingStartingTime || new Date()
            // }
            // else if (!hasPacker) {
            //       if (!packer && !packerId) {
            //             throw new Error('Packer & Packer Id is required')
            //       }
            //       STOTracking.packer = packer
            //       STOTracking.packerId = packerId
            //       STOTracking.status = "task assigned"
            //       console.log(102, STOTracking);
            // }
            // else if (hasPicker && hasPickingStartingTime && hasPickingEndingTime) {
            //       STOTracking.pickingEndingTime = pickingEndingTime || new Date()
            //       STOTracking.status = "inbound picked"
            //       console.log(107, STOTracking);
            // }
            // else if (hasPacker && hasPackingStartingTime && hasPackingEndingTime) {
            //       STOTracking.packingEndingTime = packingEndingTime || new Date()
            //       STOTracking.status = "inbound packed"
            //       console.log(112, STOTracking);
            // }

            else {
                  STOTracking.picker = picker ? picker : STOTracking.picker || null
                  STOTracking.pickerId = pickerId ? pickerId : STOTracking.pickerId || null
                  STOTracking.packer = packer ? packer : STOTracking.packer || null
                  STOTracking.packerId = packerId ? packerId : STOTracking.packerId || null
                  STOTracking.pickingStartingTime = pickingStartingTime ? pickingStartingTime : STOTracking.pickingStartingTime || null
                  STOTracking.pickingEndingTime = pickingEndingTime ? pickingEndingTime : STOTracking.pickingEndingTime || null
                  STOTracking.packingStartingTime = packingStartingTime ? packingStartingTime : STOTracking.packingStartingTime || null
                  STOTracking.packingEndingTime = packingEndingTime ? packingEndingTime : STOTracking.packingEndingTime || null
                  STOTracking.pickedSku = pickedSku ? pickedSku : STOTracking.pickedSku || null
                  STOTracking.status = status ? status : STOTracking.status || null
                  STOTracking.updatedAt = new Date()
            }

            await STOTracking.save()

            return res.status(201).send(
                  {
                        status: true,
                        message: "Updated STO Tracking",
                        data: STOTracking
                  })
      }
      catch (err) {
            console.log("Error: " + err);
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

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

const getStoAssigned = async (req, res) => {
      try {
            await search(req, res, 'task assigned')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInboundPicking = async (req, res) => {
      try {
            await search(req, res, 'inbound picking')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInboundPicked = async (req, res) => {
      try {
            await search(req, res, 'inbound picked')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInboundPacking = async (req, res) => {
      try {
            await search(req, res, 'inbound packing')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStoInboundPacked = async (req, res) => {
      try {
            await search(req, res, 'inbound packed')
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

const getAllSTOTracking = async (req,res) => {
      try {
            const { filter } = req.body
            
            const pageSize = +req.body.query.pageSize || 10;
            const currentPage = +req.body.query.currentPage || 1;
            const sortBy = req.body.query.sortBy || '_id'; // _id or description or code or po or etc.
            const sortOrder = req.body.query.sortOrder || 'desc'; // asc or desc

            const totalItems = await STOTrackingModel.find(filter).countDocuments();
            const items = await STOTrackingModel.find(filter)
                  .skip((pageSize * (currentPage - 1)))
                  .limit(pageSize)
                  .sort({ [sortBy]: sortOrder })
                  .exec()

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
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

module.exports = {
      postSTOTracking,
      updateSTOTracking,
      getSTOTracking,
      getStoPendingForDN,
      getStoInDN,
      getStoAssigned,
      getStoInboundPicking,
      getStoInboundPacking,
      getStoInboundPicked,
      getStoInboundPacked,
      getStoInGRN,
      getStoInTransit,
      getAllSTOTracking
}