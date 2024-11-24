const testApi = async (req,res) => {
    return  await res.status(200).json({
        message: "Test API success"
    });
}
module.exports = { testApi };