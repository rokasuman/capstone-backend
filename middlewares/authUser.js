import jwt from "jsonwebtoken";

// user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.token; 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again",
      });
    }

    // verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach userId 
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authUser;