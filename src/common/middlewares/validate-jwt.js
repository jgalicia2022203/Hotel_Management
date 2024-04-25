import jwt from 'jsonwebtoken'
import User from '../../users/user.model.js'

export const validarJWT = async (req, res, next) =>{
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No token in the request",
        });
    }

    try{
        const {uid} = jwt.verify(token, process.env.TOKEN_KEY);
        const usuario = await User.findById(uid);
        
        if(!usuario){
            return res.status(401).json({
                msg: 'User not exist in the DB'
            })
        }
        
        if(!usuario.status){
            return res.status(401).json({
                msg: "invalid token - user with status:false"
            })
        }

        req.usuario = usuario;

        next();
    }catch(e){
        console.log(e),
        res.status(401).json({
            msg:"Token not valid"
        })
    }
}