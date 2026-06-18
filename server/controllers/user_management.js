import pgClient from "../../config/db.js";
import httpStatus from "http-status";
import config from "config";
import APIError from "../../config/APIError.js";
import imageUpload from "../helpers/image_uploed.js";

async function get_users_details_list(req, res, next) {

    try {
        const {page_number,page_size,search_name,role} = req.body;
        const result = await pgClient.query("SELECT * FROM admin_usermanagement_get_users_list($1,$2,$3,$4)", [page_number,page_size,search_name,role]);

        if (!result) {
            throw new APIError(
                "The vehicles Details not found",
                httpStatus.NO_CONTENT,
                true,
                true
            );
        }
        return res.status(200).send({ sucsess: true, result: result.rows })
    } catch (error) {
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

async function get_driver_details_list(req, res, next) {

    try {
       
        const {page_number,page_size,search_name} = req.body;
        const result = await pgClient.query("SELECT * FROM admin_service_get_driver_list($1,$2,$3)", [page_number,page_size,search_name]);

        if (!result) {
            throw new APIError(
                "The vehicles Details not found",
                httpStatus.NO_CONTENT,
                true,
                true
            );
        }
        return res.status(200).send({ sucsess: true, result: result.rows })
    } catch (error) {
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

export default  {
    get_users_details_list,
    get_driver_details_list
}