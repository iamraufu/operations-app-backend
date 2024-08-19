const ChildPackingModel = require("../models/ChildPackingModel")

const generateChildPackingList = async (req, res) => {
      try {
            const { sto, receivingSite } = req.body

            const foundChildPackingList = await ChildPackingModel.find({ sto }).sort({_id:-1}).limit(1)

            // console.log({foundChildPackingList});
            let updatedCount = foundChildPackingList.length > 0 ? foundChildPackingList[0].count : 1

            if (foundChildPackingList.length > 0) {
                  updatedCount = foundChildPackingList[0].count + 1
            }

            let padding;
            if (updatedCount >= 1 && updatedCount <= 9) {
                  padding = '00';
            } else if (updatedCount >= 10 && updatedCount <= 99) {
                  padding = '0';
            } else {
                  return updatedCount;
            }

            updatedCount = padding + updatedCount
            const barcode = `${receivingSite}-${sto.slice(-6)}-${updatedCount}`

            const updatedData = {
                  ...req.body,
                  barcode,
                  count: parseInt(updatedCount)
            }

            const data = await ChildPackingModel.create(updatedData)

            return res.status(201).send({
                  status: true,
                  message: `Child Packing Created Successfully`,
                  data
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const getChildPackingList = async (req, res) => {
      try {
            await search(req, res)
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
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

      const totalItems = await ChildPackingModel.find(filter).countDocuments();
      const items = await ChildPackingModel.find(filter)
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
      generateChildPackingList,
      getChildPackingList
}