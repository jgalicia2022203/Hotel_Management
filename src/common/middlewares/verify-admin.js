export const isAdmin = (req, res, next) =>{
    const user = req.usuario;

    if(user.role == 'ADMIN_HOTEL') return next()

    return res.status(400).json({
        msg: "You not have acces, only admin"
    })
}

export const isClient = (req, res, next) =>{
    const user = req.usuario

    if(user.role == "VISIT_ROLE") return next()

    return res.status(400).json({
        msg: "You not have access, only clients"
    })
}