const ReadOne = async (collection, findBy = {}) => {
      console.log(collection, findBy)
      const result = await collection.findOne(findBy)
      return result
}

module.exports = {
      ReadOne
}