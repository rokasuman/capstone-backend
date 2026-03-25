import doctorModel from "../models/doctorModel.js";

// api to change availability of doctor
const changeAvailiabity = async (req, res) => {
  try {

    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({
      success: true,
      message: "Availability changed",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};
//api to fetch the doc in fe
const doctorList =async (req,res) =>{
  try {
    const doctors = await doctorModel.find({}).select(["-password","-email"])
    res.json({success:true,doctors})
  } catch (error) {
    console.log(error)
    res.json({success:true,message:error.message})
  }
}

export { changeAvailiabity,doctorList };