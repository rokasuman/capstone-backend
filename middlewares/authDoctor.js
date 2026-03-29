import jwt from "jsonwebtoken";

// user authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const  {dtoken}  = req.headers

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again"
      });
    }

    // verifying the token
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.body =req.body || {}
    req.body.docId=token_decode.id;
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export default authDoctor;