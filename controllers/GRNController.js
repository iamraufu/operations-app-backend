const POTrackingModel = require('../models/POTrackingModel');
const STOTrackingModel = require('../models/STOTrackingModel');
const GRNModel = require('../models/GRNModel');

const POGRN = async (req, res) => {
      try {
            const po = req.body[0].po
            const bodyDetails = {
                  "GRNDocument": po,
                  "GRNData": req.body.map(item => ({
                        movementType: item.movementType,
                        movementIndicator: item.movementIndicator,
                        po: item.po,
                        poItem: item.poItem,
                        material: item.material,
                        plant: item.plant,
                        storageLocation: item.storageLocation,
                        quantity: item.quantity,
                        uom: item.uom,
                        uomIso: item.uomIso
                  }))
            }

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(bodyDetails)
            }

            const response = await fetch('http://202.74.246.133:81/sap/qs/create_grn.php', requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE.trim()
                  })
            }
            else {
                  const filter = {
                        po
                  }

                  let POTracking = await POTrackingModel.findOne(filter)

                  if (POTracking === null) {
                        return res.status(404).json({
                              status: false,
                              message: `PO tracking status not updated but converted to GRN`,
                              data: {
                                    grn: data.MATERIALDOCUMENT.trim(),
                                    documentYear: data.MATDOCUMENTYEAR.trim(),
                                    items: data.GOODSMVT_ITEM.map(item => ({
                                          material: item.MATERIAL.trim(),
                                          plant: item.PLANT.trim(),
                                          storageLocation: item.STGE_LOC.trim(),
                                          movementType: item.MOVE_TYPE.trim(),
                                          entryQuantity: item.ENTRY_QNT,
                                          entryUOM: item.ENTRY_UOM.trim(),
                                          entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                          po: item.PO_NUMBER.trim(),
                                          poItem: item.PO_ITEM.trim(),
                                          movementIndicator: item.MVT_IND.trim()
                                    })
                                    )
                              }
                        })
                  }
                  else {
                        POTracking.status = "in grn"
                        POTracking.grn = data.MATERIALDOCUMENT.trim()
                  }

                  await POTracking.save()

                  res.status(200).json({
                        status: true,
                        data: {
                              grn: data.MATERIALDOCUMENT.trim(),
                              documentYear: data.MATDOCUMENTYEAR.trim(),
                              items: data.GOODSMVT_ITEM.map(item => ({
                                    material: item.MATERIAL.trim(),
                                    plant: item.PLANT.trim(),
                                    storageLocation: item.STGE_LOC.trim(),
                                    movementType: item.MOVE_TYPE.trim(),
                                    entryQuantity: item.ENTRY_QNT,
                                    entryUOM: item.ENTRY_UOM.trim(),
                                    entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                    po: item.PO_NUMBER.trim(),
                                    poItem: item.PO_ITEM.trim(),
                                    movementIndicator: item.MVT_IND.trim()
                              })
                              )
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted' : err}`
            })
      }
}

const STOGRN = async (req, res) => {
      try {
            const sto = req.body[0].sto

            const bodyDetails = {
                  "GRNDocument": sto,
                  "GRNData": req.body.map(item => ({
                        movementType: item.movementType,
                        movementIndicator: item.movementIndicator,
                        po: item.sto,
                        poItem: item.stoItem,
                        material: item.material,
                        plant: item.plant,
                        storageLocation: item.storageLocation,
                        quantity: item.quantity,
                        uom: item.uom,
                        uomIso: item.uomIso
                  }))
            }

            const requestOptions = {
                  method: 'POST',
                  body: JSON.stringify(bodyDetails)
            }
            const response = await fetch('http://202.74.246.133:81/sap/qs/create_grn.php', requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE.trim()
                  })
            }
            else {
                  const filter = {
                        sto
                  }

                  let STOTracking = await STOTrackingModel.findOne(filter)

                  if (STOTracking === null) {
                        return res.status(404).json({
                              status: false,
                              message: `STO tracking status not updated but converted to GRN`,
                              data: {
                                    grn: data.MATERIALDOCUMENT.trim(),
                                    documentYear: data.MATDOCUMENTYEAR.trim(),
                                    items: data.GOODSMVT_ITEM.map(item => ({
                                          material: item.MATERIAL.trim(),
                                          plant: item.PLANT.trim(),
                                          storageLocation: item.STGE_LOC.trim(),
                                          movementType: item.MOVE_TYPE.trim(),
                                          entryQuantity: item.ENTRY_QNT,
                                          entryUOM: item.ENTRY_UOM.trim(),
                                          entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                          po: item.PO_NUMBER.trim(),
                                          poItem: item.PO_ITEM.trim(),
                                          movementIndicator: item.MVT_IND.trim()
                                    })
                                    )
                              }
                        })
                  }
                  else {
                        STOTracking.status = "in grn"
                        STOTracking.grn = data.MATERIALDOCUMENT.trim()
                  }

                  await STOTracking.save()

                  res.status(200).json({
                        status: true,
                        data: {
                              grn: data.MATERIALDOCUMENT.trim(),
                              documentYear: data.MATDOCUMENTYEAR.trim(),
                              items: data.GOODSMVT_ITEM.map(item => ({
                                    material: item.MATERIAL.trim(),
                                    plant: item.PLANT.trim(),
                                    storageLocation: item.STGE_LOC.trim(),
                                    movementType: item.MOVE_TYPE.trim(),
                                    entryQuantity: item.ENTRY_QNT,
                                    entryUOM: item.ENTRY_UOM.trim(),
                                    entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                    po: item.PO_NUMBER.trim(),
                                    poItem: item.PO_ITEM.trim(),
                                    movementIndicator: item.MVT_IND.trim()
                              })
                              )
                        }
                  })
            }
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted' : err}`
            })
      }
}

const pendingPOForGRN = async (req, res) => {
      try {

            await GRNModel.create(req.body)

            return res.status(201).send(
                  {
                        status: true,
                        message: "GRN data posted successfully!"
                  })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const getPendingPOForGRN = async (req, res) => {
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

const updatePendingPOForGRN = async (req, res) => {
      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `GRN Id incorrect`
                  })
            }

            const grn = await GRNModel.findById(id)
            const grnExist = Boolean(grn)

            if (!grnExist) {
                  return res.status(401).json({
                        status: false,
                        message: `GRN doesn't exist`,
                  });
            }

            grnDetails = {
                  ...req.body,
                  updatedAt: new Date()
            }

            let updatedGRN = await GRNModel.findByIdAndUpdate
                  (
                        id, grnDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "GRN updated successfully",
                  grn: updatedGRN
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

      const totalItems = await GRNModel.find(filter).countDocuments();
      const items = await GRNModel.find(filter)
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
      pendingPOForGRN,
      updatePendingPOForGRN,
      getPendingPOForGRN,
      POGRN,
      STOGRN
}