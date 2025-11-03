import jwt from 'jsonwebtoken'

// admin authentification middleware 

const authAdmin = async (req,res,next) =>{
    try {

        const {atoken} = req.headers
        if(!atoken){
            res.json({success:false,message:"Not Authroeixed Try Again"})
        }
        
        const token_decode = jwt.verify(atoken,process.env.JWT_SECERT)

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ){
            res.json({success:false,message:"Not Authroeixed Try Again"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({success:true, message:error.message})
        
        
    }
}
export default authAdmin