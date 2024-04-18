// const OutletModel = require('../models/OutletModel');

const outlets = async (req, res) => {

      const fetchData = async () => {

            try {
                  const response = await fetch('http://202.74.246.133:81/sap/qs/get_outlets.php')
                  const data = await response.json()

                  const outlets = await data.IT_SITE.length > 0 ? await data.IT_SITE.map(outlet => (
                        {
                              code: outlet.WERKS.trim(),
                              name: outlet.NAME1.trim(),
                              address: outlet.STRAS.trim(),
                              district: outlet.ORT01.trim()
                        }
                  )) : []

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
                        outlets
                  })
            }
            catch (err) {
                  res.status(500).json({
                        status: false,
                        message: `${err.message === 'fetch failed' ? 'MIS Logged Off the PC where BAPI is Hosted': err}`
                  })
            }
      }

      fetchData()
}

module.exports = {
      outlets
}