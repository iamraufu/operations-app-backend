const ArticleModel = require('../models/ArticleModel')
const mongoose = require('mongoose')

const products = async (req, res) => {
      const fetchData = async () => {

            try {
                  const response = await fetch('http://202.74.246.133:81/sap/outlet_automation/get_materials.php')
                  const data = await response.json()

                  const products = data.MATNRLIST.map(product => (
                        {
                              code: product.MATERIAL.trim(),
                              description: product.MATL_DESC.trim()
                        }
                  ))

                  // outlets.forEach(async (outlet) => {
                  //       try {
                  //             await OutletModel.updateOne(
                  //                   { code: outlet.code },
                  //                   {
                  //                         $set: {
                  //                               code: outlet.code,
                  //                               name: outlet.name,
                  //                               address: outlet.address,
                  //                               district: outlet.district
                  //                         },
                  //                         updatedAt: new Date()
                  //                   },
                  //                   { upsert: true }
                  //             );

                  //             console.log(`Upserted: ${outlet.code}`);
                  //       }
                  //       catch (error) {
                  //             console.error(`Error upserting ${outlet.code}: ${error.message}`);
                  //       }
                  // })

                  res.status(200).json({
                        status: true,
                        products
                  })
            }
            catch (err) {
                  res.status(500).json({
                        status: false,
                        message: `${err}`
                  })
            }
      }

      fetchData()
}

module.exports = {
      products
}