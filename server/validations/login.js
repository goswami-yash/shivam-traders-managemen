import Joi from "joi";

export default {

    loginUser : {
        body : Joi.object({
            mobile_no: Joi.string().required(),
            password: Joi.string().required()
        })
    }
}