import { Router } from "express";
import {check} from "express-validator"

import{
    usuarioPost,
    usuarioGet,
    usuarioDelete,
    usuarioPut
} from './user.controller.js'

import{
    existeEmail,
    existeUsuarioById
} from '../common/helpers/db-validators.js'

import { validateFields } from "../common/middlewares/validate-fields.js";
import { validarJWT } from "../common/middlewares/validate-jwt.js";

const router = Router();

router.get("/", usuarioGet)

router.post(
    "/",
    [
        check("name", "The name is obligatory").not().isEmpty(),
        check("email", "The email is obligatory").isEmail(),
        check("email").custom(existeEmail),
        check("password", "The password is most be 6 characters").isLength({min: 6}),
        validateFields,
    ], usuarioPost)

    router.put(
        "/:id",
        [
            check("id", "The id is not valid"),
            check("id").custom(existeUsuarioById),
            validateFields,
        ], usuarioPut)
    
    router.delete(
        "/:id",
        [
            validarJWT,
            check("id", "The id is not valid").isMongoId(),
            check("id").custom(existeUsuarioById),
            validateFields,
        ], usuarioDelete )


export default router;
