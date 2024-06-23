const InventoryModel = require('../models/InventoryModel')

const addStock = async (req, res) => {
      try {
            const {
                  material,
                  description,
                  quantity,
                  site,
                  bin,
                  gondola,
                  batch,
                  expiryDate
            } = req.body

            const filter = {
                  material,
                  site,
                  bin,
                  gondola
            }

            let inventoryItem = await InventoryModel.findOne(filter);

            if (!inventoryItem) {

                  let inventoryDetails = {
                        material,
                        description,
                        quantity,
                        site,
                        bin,
                        gondola,
                        tracking: [
                              {
                                    batch,
                                    expiryDate,
                                    quantity
                              }
                        ]
                  }

                  const inventoryItem = await InventoryModel.create(inventoryDetails)

                  return res.status(201).send(
                        {
                              status: true,
                              message: `Stock added successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                              inventoryItem,
                        }
                  )
            }
            else {
                  inventoryItem.quantity += quantity;
                  inventoryItem.updatedAt = new Date()
                  inventoryItem.tracking.push({
                        batch,
                        expiryDate,
                        quantity
                  })

                  await inventoryItem.save();

                  return res.status(200).send(
                        {
                              status: true,
                              message: `Stock added successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                              inventoryItem,
                        }
                  )
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const removeStock = async (req, res) => {
      try {

            const { material, site, bin, gondola, quantity } = req.body

            const filter = {
                  material,
                  site,
                  bin,
                  gondola
            }

            let inventoryItem = await InventoryModel.findOne(filter)

            if (!inventoryItem) {
                  res.status(404).json({
                        status: false,
                        message: `Material ${material} not found in inventory`
                  })
            }

            if (inventoryItem.quantity < quantity) {
                  return res.status(409).send({
                        status: false,
                        message: `Insufficient stock for ${material}. Available quantity: ${inventoryItem.quantity}`
                  })
            }

            // Added for removing quantity from array of objects
            const items = inventoryItem.tracking
            let remainingQuantity = quantity

            for (let i = 0; i < items.length; i++) {
                  const item = items[i];

                  if (remainingQuantity >= item.quantity) {
                        remainingQuantity -= item.quantity;
                        item.updatedAt = new Date()
                        items.splice(i, 1);
                        i--;
                  }
                  else {
                        item.quantity -= remainingQuantity;
                        item.updatedAt = new Date()
                        break;
                  }
            }

            // Till above

            // inventoryItem.quantity -= quantity;
            // inventoryItem.onHold -= quantity;
            inventoryItem.updatedAt = new Date()

            await inventoryItem.save();

            return res.status(200).send(
                  {
                        status: true,
                        message: `Stock removed successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                        inventoryItem,
                  }
            )
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getStock = async (req, res) => {
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

      const totalItems = await InventoryModel.find(filter).countDocuments();
      const items = await InventoryModel.find(filter)
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

const addHoldStock = async (req, res) => {
      try {
            const { material, site, bin, gondola, onHold } = req.body

            const filter = {
                  material,
                  site,
                  bin,
                  gondola
            }

            let inventoryItem = await InventoryModel.findOne(filter);

            if (!inventoryItem) {
                  // const inventoryItem = await InventoryModel.create(req.body)

                  // return res.status(201).send(
                  //       {
                  //             status: true,
                  //             message: `Stock added successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                  //             inventoryItem,
                  //       }
                  // )

                  res.status(404).json({
                        status: false,
                        message: `Material ${material} not found in inventory`
                  })
            }
            else {
                  inventoryItem.onHold += onHold;
                  inventoryItem.updatedAt = new Date()
                  await inventoryItem.save();

                  return res.status(200).send(
                        {
                              status: true,
                              message: `Stock hold successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                              inventoryItem,
                        }
                  )
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const removeHoldStock = async (req, res) => {
      try {
            const { material, site, bin, gondola, onHold } = req.body

            const filter = {
                  material,
                  site,
                  bin,
                  gondola
            }

            let inventoryItem = await InventoryModel.findOne(filter);

            if (!inventoryItem) {
                  // const inventoryItem = await InventoryModel.create(req.body)

                  // return res.status(201).send(
                  //       {
                  //             status: true,
                  //             message: `Stock added successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                  //             inventoryItem,
                  //       }
                  // )

                  res.status(404).json({
                        status: false,
                        message: `Material ${material} not found in inventory`
                  })
            }
            else {
                  inventoryItem.onHold -= onHold;
                  inventoryItem.updatedAt = new Date()
                  await inventoryItem.save();

                  return res.status(200).send(
                        {
                              status: true,
                              message: `Stock hold successfully for ${material} at ${site} in ${bin} of ${gondola}`,
                              inventoryItem,
                        }
                  )
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            });
      }
}

const getAllInventory = async (req, res) => {
      try {
            const { filter } = req.body
            
            const pageSize = +req.body.query.pageSize || 10;
            const currentPage = +req.body.query.currentPage || 1;
            const sortBy = req.body.query.sortBy || '_id'; // _id or description or code or po or etc.
            const sortOrder = req.body.query.sortOrder || 'desc'; // asc or desc

            const totalItems = await InventoryModel.find(filter).countDocuments();
            const items = await InventoryModel.find(filter)
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
      addStock,
      removeStock,
      addHoldStock,
      removeHoldStock,
      getStock,
      getAllInventory
}