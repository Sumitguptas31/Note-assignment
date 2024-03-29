const jwt = require('jsonwebtoken')
const NoteModel=require('../Models/NoteModel')
const authentication = async (req, res, next) => {
    try {
        const token = req.header('x-api-key')
        if(!token) {
            res.status(403).send({status: false, message: `Missing authentication token in request`})
            return;
        }

        const decoded = await jwt.verify(token, 'someverysecuredprivatekey')

        if(!decoded) {
            res.status(403).send({status: false, message: `Invalid authentication token in request`})
            return;
        }

        req.UserId = decoded.UserId;
        console.log(req.UserId)

        next()
    } catch (error) {
        console.error(`Error! ${error.message}`)
        res.status(500).send({status: false, message: error.message})
    }
}


const authorisation=async (req,res,next) =>{
    try{
        let token= req.headers['x-api-key'];
        let validToken= jwt.verify(token,'someverysecuredprivatekey')
        if(!validToken) return res.status(401).send({error:"You are not authenticated user"})
        
        let NoteId = req.params.NoteId
        
        //if( !NoteId )   NoteId = req.query.NoteId
        
        if( !NoteId)   return res.status(400).send({error : " Please , enter NoteId "})
        const data = await NoteModel.find({ _id : NoteId})
        if(!data)  return res.status(400).send({error : "Invalid NoteId"})
    
    
        let Id= await NoteModel.findById(NoteId).select({userId:1})
        console.log(Id)
        let Notetobemodified=Id.userId
        console.log(Notetobemodified)
        let userloggedin=validToken.UserId
        console.log(userloggedin)
        if(Notetobemodified!=userloggedin){return res.status(403).send({msg:"Authorisation failed"})}
    
       
        
        next();
        }catch(err){
            res.status(500).send({error:err.message})
        }
    
    
    }
    


module.exports.authentication=authentication
module.exports.authorisation= authorisation