const ArticleTrackingModel = require('../models/ArticleTrackingModel');

const postArticleTracking = async (req, res) => {
      try {
            const { po, sto, code, quantity } = req.body
            const filter = {
                  po: po || "",
                  sto: sto || "",
                  code,
                  quantity
            }

            const isAlreadyArticleInTracking = Boolean(await ArticleTrackingModel.findOne(filter))

            if (isAlreadyArticleInTracking) {
                  return res.status(409).send({
                        status: false,
                        message: `Material ${code} with quantity of ${quantity} of ${po || sto} has already been tracked`
                  })
            }
            else {
                  const data = await ArticleTrackingModel.create(req.body)

                  return res.status(201).send({
                        status: true,
                        message: `Material ${code} with quantity of ${quantity} in ${po || sto} is ready for tracking`,
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

const updateArticleTracking = async (req, res) => {
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
                  pickedQuantity,
                  status
            } = req.body

            // console.log(req.body);

            const filter = {
                  sto
            }

            const ArticleTracking = await ArticleTrackingModel.findOne(filter)

            if (ArticleTracking === null) {
                  return res.status(404).json({
                        status: false,
                        message: `STO id incorrect`
                  })
            }

            // const {
            //       inboundPicker: hasPicker,
            //       inboundPacker: hasPacker,
            //       inboundPickingStartingTime: hasPickingStartingTime,
            //       inboundPickingEndingTime: hasPickingEndingTime,
            //       inboundPackingStartingTime: hasPackingStartingTime,
            //       inboundPackingEndingTime: hasPackingEndingTime
            // } = ArticleTracking

            // console.log(hasPicker,
            //       hasPacker,
            //       hasPickingStartingTime,
            //       hasPickingEndingTime,
            //       hasPackingStartingTime,
            //       hasPackingEndingTime);

            // if (hasPicker && hasPickingStartingTime) {
            //       ArticleTracking.status = "inbound picking"
            //       ArticleTracking.pickingStartingTime = pickingStartingTime || new Date()
            // }
            // else if (!hasPicker) {
            //       if (!picker && !pickerId) {
            //             throw new Error('Picker & Picker Id is required')
            //       }
            //       ArticleTracking.inboundPicker = picker
            //       ArticleTracking.inboundPickerId = pickerId
            //       ArticleTracking.status = "task assigned"
            // }
            // else if (hasPacker && hasPackingStartingTime) {
            //       ArticleTracking.status = "inbound packing"
            //       ArticleTracking.inboundPackingStartingTime = packingStartingTime || new Date()
            // }
            // else if (!hasPacker) {
            //       if (!packer && !packerId) {
            //             throw new Error('Packer & Packer Id is required')
            //       }
            //       ArticleTracking.inboundPacker = packer
            //       ArticleTracking.inboundPackerId = packerId
            //       ArticleTracking.status = "task assigned"
            //       console.log(107, ArticleTracking);
            // }
            // else if (hasPicker && hasPickingStartingTime && hasPickingEndingTime) {
            //       ArticleTracking.inboundPickingEndingTime = pickingEndingTime || new Date()
            //       ArticleTracking.status = "inbound picked"
            //       console.log(112, ArticleTracking);
            // }
            // else if (hasPacker && hasPackingStartingTime && hasPackingEndingTime) {
            //       ArticleTracking.inboundPackingEndingTime = packingEndingTime || new Date()
            //       ArticleTracking.status = "inbound packed"
            //       console.log(117, ArticleTracking);
            // }

            else {
                  ArticleTracking.inboundPicker = picker ? picker : ArticleTracking.inboundPicker || null
                  ArticleTracking.inboundPickerId = pickerId ? pickerId : ArticleTracking.inboundPickerId || null
                  ArticleTracking.inboundPacker = packer ? packer : ArticleTracking.inboundPacker || null
                  ArticleTracking.inboundPackerId = packerId ? packerId : ArticleTracking.inboundPackerId || null
                  ArticleTracking.inboundPickingStartingTime = pickingStartingTime ? pickingStartingTime : ArticleTracking.inboundPickingStartingTime || null
                  ArticleTracking.inboundPickingEndingTime = pickingEndingTime ? pickingEndingTime : ArticleTracking.inboundPickingEndingTime || null
                  ArticleTracking.inboundPackingStartingTime = packingStartingTime ? packingStartingTime : ArticleTracking.inboundPackingStartingTime || null
                  ArticleTracking.inboundPackingEndingTime = packingEndingTime ? packingEndingTime : ArticleTracking.inboundPackingEndingTime || null
                  ArticleTracking.pickedQuantity = pickedQuantity ? pickedQuantity : ArticleTracking.pickedQuantity || null
                  ArticleTracking.status = status ? status : ArticleTracking.status || null
                  ArticleTracking.updatedAt = new Date()
            }

            await ArticleTracking.save()

            return res.status(201).send(
                  {
                        status: true,
                        message: "Updated Article Tracking",
                        data: ArticleTracking
                  })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// Get all article
const getAllArticleTracking = async (req, res) => {
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

// Get in document article
const getArticleInDocument = async (req, res) => {
      try {
            await search(req, res, 'in document')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

// Get article inbound picking
const getArticleInboundPicking = async (req, res) => {
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

// Get article inbound packing
const getArticleInboundPacking = async (req, res) => {
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

// Get article inbound picked
const getArticleInboundPicked = async (req, res) => {
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

// Get article inbound packed
const getArticleInboundPacked = async (req, res) => {
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

      const totalItems = await ArticleTrackingModel.find(filter).countDocuments();
      const items = await ArticleTrackingModel.find(filter)
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
      postArticleTracking,
      getAllArticleTracking,
      getArticleInDocument,
      getArticleInboundPicking,
      getArticleInboundPacking,
      getArticleInboundPicked,
      getArticleInboundPacked,
      updateArticleTracking
}