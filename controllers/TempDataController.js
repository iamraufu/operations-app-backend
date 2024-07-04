
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



// by upol

const getAllTempDataByPost = async (req, res) => {
      const { po, userId, type}  = req.body

      try {
            const items = await TempDataModel.findOne({
                      "userId": userId,
                      "data.0.po": po,
                      "type": type
            })
            console.log(items);
            if(items){                  
                  return res.status(200).json({
                        status: true,
                        _id: items._id,
                        items:items.data,
                        count: items.data.length,
                        message: "Data found"
                  });
            }else{
                  return res.status(200).json({
                        status: true,
                        items: [],
                        count: 0,
                        message: "Data not found"
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


const createOrUpdateTempData = async (req, res) => {

      let filter = {}

      const articleObj = req.body

      if(articleObj.type === "grn data" ){

            filter = {
                        userId:articleObj.userId, 
                        type:articleObj.type,
                        "data.po": articleObj.po,
                        // "data.material": articleObj.material
                     }
      }

      // console.log(filter);


      const mongoData = await TempDataModel.findOne(filter)

      // console.log({mongoData});


      try {
            if(!mongoData){

                  const formattedData = {
                        userId:articleObj.userId, 
                        type:articleObj.type, 
                        data:[
                              articleObj
                        ]
                  }

                  const tempData = await TempDataModel.create(formattedData)
                  await res.status(201).json({
                        status: true,
                        message: "Added to Temp Data",
                        tempData
                  })
            }

            if(mongoData){
                  const materialFound = mongoData.data.find( item => item.material === req.body.material )

                  const index = mongoData.data.findIndex(item => item.material === req.body.material );

                  // console.log({index});

                  let key = `data.${index}.quantity`

                  if(materialFound){
                        const tempData = await TempDataModel.findOneAndUpdate(
                              filter,
                              {
                                  $inc: { [key]: req.body.quantity }
                              },
                              { new: true }
                          );
      
                          
                          await res.status(201).json({
                              status: true,
                              message: "Updated to Temp Data",
                        })
                  }else{
                        mongoData.data.push(articleObj)
                        await mongoData.save()
                        await res.status(201).json({
                              status: true,
                              message: "Updated to Temp Data",
                        })
                  }
            }


      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }

      // try {
      //       await search(req, res)
      // }
      // catch (err) {
      //       res.status(500).json({
      //             status: false,
      //             message: `${err}`
      //       })
      // }
}



module.exports = {
      addTempData,
      getAllTempData,
      updateTempData,
      deleteTempData,
      createOrUpdateTempData,
      getAllTempDataByPost
}