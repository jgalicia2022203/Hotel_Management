import { response, request, json } from "express";
import bcryptjs from 'bcryptjs'
import User from '../users/user.model.js'

export const usuarioGet = async (req = request, res = response) =>{
    const {limite, desde} = req.query;
    const query = {status: true}

    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.status(200).json({
        total,
        usuarios
    })
}

export const usuarioPost = async (req, res) =>{
    const {name, email, password} = req.body
    const usuario = new User({name, email, password})

    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)

    await usuario.save()

    res.status(200).json({
        usuario
    })
}

export const usuarioPut = async (req, res = response) =>{
    const {id} = req.params;
    const {id_, password, ...resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    await User.findByIdAndUpdate(id, resto);

    const usuario = await User.findOne({_id: id})

    res.status(200).json({
        msg: 'Usuario exitosamente actualizado!',
        usuario
    })
}

export const usuarioDelete = async(req, res) =>{
    const {id} = req.params

    const usuario = await User.findByAndUpdate(id, {status: false})
    const usuarioAutenticacdo = req.usuario;

    res.status(200).json({msg: 'Usuario eliminado!', usuario, usuarioAutenticacdo})
}