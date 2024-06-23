const POTrackingModel = require('../models/POTrackingModel');
const STOTrackingModel = require('../models/STOTrackingModel');
const GRNModel = require('../models/GRNModel');
const mongoose = require('mongoose');

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

            const response = await fetch(`${process.env.SAP_QS}create_grn_from_po.php`, requestOptions)
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
                        return res.status(200).json({
                              status: true,
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
                        console.log(data.MATERIALDOCUMENT.trim());
                        POTracking.grn.push(data.MATERIALDOCUMENT.trim())
                        console.log(POTracking.grn);
                        POTracking.updatedAt = new Date()
                        console.log(POTracking);
                        await POTracking.save()
                  }

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
            const dn = req.body[0].dn
            const sto = req.body[0].sto

            const bodyDetails = {
                  "GRNDocument": dn,
                  "GRNData": req.body.map(item => ({
                        movementType: item.movementType,
                        movementIndicator: item.movementIndicator,
                        po: item.sto,
                        dn: item.dn,
                        poItem: item.stoItem,
                        dnItem: item.dnItem,
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

            console.log(requestOptions);

            const response = await fetch(`${process.env.SAP_QS}create_grn_from_sto.php`, requestOptions)
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
                        return res.status(200).json({
                              status: true,
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
                        STOTracking.grn = await data.MATERIALDOCUMENT.trim()
                        STOTracking.updatedAt = new Date()
                        await STOTracking.save()
                  }

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
            console.log(err);
            res.status(500).json({
                  status: false,
                  message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted' : err}`
            })
      }
}

const TPN = async (req, res) => {
      try {
            const dn = req.body[0].dn

            const bodyDetails = {
                  "GRNDocument": dn,
                  "GRNData": req.body.map(item => ({
                        po: item.sto,
                        poItem: item.stoItem,
                        dn: item.dn,
                        dnItem: item.dnItem,
                        material: item.material,
                        plant: item.plant,
                        movementType: item.movementType,
                        movementIndicator: item.movementIndicator,
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
            const response = await fetch(`${process.env.SAP_QS}create_tpn.php`, requestOptions)
            const data = await response.json()

            if (data?.RETURN[0]?.TYPE === 'E') {
                  res.status(404).json({
                        status: false,
                        message: data.RETURN[0].MESSAGE.trim()
                  })
            }
            else {

                  res.status(200).json({
                        status: true,
                        data: {
                              tpn: data.MATERIALDOCUMENT.trim(),
                              documentYear: data.MATDOCUMENTYEAR.trim(),
                              items: data.GOODSMVT_ITEM.map(item => ({
                                    material: item.MATERIAL.trim(),
                                    plant: item.PLANT.trim(),
                                    storageLocation: item.STGE_LOC.trim(),
                                    movementType: item.MOVE_TYPE.trim(),
                                    entryQuantity: item.ENTRY_QNT,
                                    entryUOM: item.ENTRY_UOM.trim(),
                                    entryUOMISO: item.ENTRY_UOM_ISO.trim(),
                                    sto: item.PO_NUMBER.trim(),
                                    stoItem: item.PO_ITEM.trim(),
                                    dn: item.DELIV_NUMB_TO_SEARCH.trim(),
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

            const grn = await GRNModel.create({
                  ...req.body,
                  createdAt: new Date()
            })

            return res.status(201).send(
                  {
                        status: true,
                        message: "GRN data posted successfully!",
                        data: grn
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

            const { id } = req.params

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

const getAllPendingPOForGRN = async (req, res) => {
      try {
            const { filter } = req.body
            
            const pageSize = +req.body.query.pageSize || 10;
            const currentPage = +req.body.query.currentPage || 1;
            const sortBy = req.body.query.sortBy || '_id'; // _id or description or code or po or etc.
            const sortOrder = req.body.query.sortOrder || 'desc'; // asc or desc

            const totalItems = await GRNModel.find(filter).countDocuments();
            const items = await GRNModel.find(filter)
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
            })
      }
}

module.exports = {
      pendingPOForGRN,
      updatePendingPOForGRN,
      getPendingPOForGRN,
      getAllPendingPOForGRN,
      POGRN,
      STOGRN,
      TPN
}