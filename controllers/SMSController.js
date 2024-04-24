const SMSModel = require("../models/SMSModel");
const PromoCodeModel = require("../models/PromoCodeModel");
// const promocodes = require ('../data/promocodes.json')

const sendSMS = async (req, res) => {

      const { name, phone, code, description } = req.body

      // For Creating Bulk Promo Code
      // const promoCode = await PromoCodeModel.create(promocodes)
      // res.send(promoCode)

      const smsFilter = {
            phone
      }

      const smsAlreadySent = await SMSModel.findOne(smsFilter)
      const isSmsAlreadySent = Boolean(smsAlreadySent)

      if (isSmsAlreadySent) {
            res.status(409).json({
                  status: true,
                  message: `SMS Already Sent to ${phone}`,
                  data: smsAlreadySent
            })
      }

      const promoFilter = {
            status: "unused"
      }

      let unusedPromoCode = await PromoCodeModel.findOne(promoFilter).limit(1)
      const isUnusedPromoCodeAvailable = Boolean(unusedPromoCode)

      if (!isUnusedPromoCodeAvailable) {
            res.status(409).json({
                  status: false,
                  message: `No available promo codes`,
            })
      }

      // const message = `Dear ${name}, your coupon code is ${unusedPromoCode.code}`

      const message = `সম্মানিত ক্রেতা, অভিনন্দন! \nস্বপ্ন থেকে ট্যাং ২ কেজি পণ্যটি ক্রয় করে আপনি একটি কুপন বিজয়ী হয়েছেন। \nকুপন কোড: ${unusedPromoCode.code} \nএই কুপনটি ব্যবহার করে স্বপ্ন থেকে ৫০০ টাকার ফ্রি বাজার বুঝে নিন। \n*শ/প্র স্বপ্ন`

      const smsUrl = `https://api.mobireach.com.bd/SendTextMessage?Username=shwapno&Password=Shw@pno@dhk2023&From=8801847170370&To=${phone}&Message=${message}`

      if (!isSmsAlreadySent && isUnusedPromoCodeAvailable) {
            const response = await fetch(smsUrl)

            const writeToDBData = {
                  name,
                  phone,
                  code,
                  description,
                  promo: unusedPromoCode.code
            }

            if (response.status === 200) {

                  const data = await SMSModel.create(writeToDBData)
                  unusedPromoCode.status = "used"

                  await unusedPromoCode.save()

                  await res.status(200).json({
                        status: true,
                        message: `SMS Sent Successfully`,
                        data
                  })
            }
      }
}

const updateSMS = async (req, res) => {
      const { phone, invoice } = req.body

      const smsFilter = {
            phone
      }

      let smsAlreadySent = await SMSModel.findOne(smsFilter)
      const isInvoiceExist = smsAlreadySent?.invoice?.length > 0

      if (isInvoiceExist) {
            res.status(409).json({
                  status: true,
                  message: `Invoice Already saved`,
            })
      }

      smsAlreadySent.invoice = invoice
      smsAlreadySent.updatedAt = new Date()
      smsAlreadySent.status = "invoice updated"
      await smsAlreadySent.save()

      await res.status(200).json({
            status: true,
            message: `Invoice Updated Successfully`,
            data: smsAlreadySent
      })
}

module.exports = {
      sendSMS,
      updateSMS
}