import User from '../../users/user.model.js'

export const existeEmail = async (email = '') =>{
    const existeEmail = await User.findOne({email})
    if(existeEmail){
        throw new Error(`The Email ${email} has already been registred`)
    }
}

export const existeUsuarioById = async (id = '') =>{
    const existeUsuario = await User.findById(id)
    if(!existeUsuario){
        throw new Error(`The id: ${email} does not exist`)
    }
}