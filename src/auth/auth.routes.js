import { Router } from "express";
import { check } from "express-validator";

import { auth } from "./auth.controller.js";
import {validateFields} from '../common/middlewares/validate-fields.js'

const router = Router();

router.post(
    '/login',
    [
        check('email', 'This email is not valid').isEmail(),
        check('password', 'The password id obligatory').not().isEmpty(),
        validateFields,     
    ], auth)

export default router;
