import pgClient from "../../config/db.js";

import httpStatus from "http-status";
import config from "config";
import APIError from "../../config/APIError.js";
import imageUpload from "../helpers/image_uploed.js";

async function get_vehicles_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_get_order_time_vehicles_details()", []);

        if (!result) {
            throw new APIError(
                "The Order Details not found",
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

async function get_labourers_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_get_order_time_labourers_details()", []);

        if (!result) {
            throw new APIError(
                "The Order Details not found",
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

async function get_items_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_get_order_time_items_details()", []);

        if (!result) {
            throw new APIError(
                "The Order Details not found",
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

async function get_customers_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_get_order_time_customers_details()", []);

        if (!result) {
            throw new APIError(
                "The Order Details not found",
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

async function driver_order_crate(req, res, next) {

    try {
        const {
            vehicle_id,
            total_loaded_weight,
            loading_bilty_url,
            start_odometer,
            end_odometer,
            advance_bhada,
            other_kharch,
            vehicle_rate_per_ton,
            trip_allowance,
            transporter_id,
            transporter_name,
            contentType,
            labour,
            delivery
        } = req.body;

        const driver_id = req.user.id;

        //console.log("Request Body:", req.body); // Debugging log
        //console.log("Driver ID:", driver_id); // Debugging log
        const type = "bilty_img";
        const result = await pgClient.query("SELECT * FROM user_create_order($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [
            vehicle_id,
            driver_id,
            total_loaded_weight,
            loading_bilty_url,
            start_odometer || 0,
            end_odometer || 0,
            advance_bhada || 0,
            other_kharch || 0,
            vehicle_rate_per_ton || 0,
            trip_allowance || 0,
            transporter_id || 0,
            transporter_name || null,
            labour ? JSON.stringify(labour) : null,
            delivery ? JSON.stringify(delivery) : null
        ]);

        //console.log("Database Result:", result); // Debugging log

        if (!result.rows.length) {
            throw new APIError(
                "Order not createdd",
                httpStatus.BAD_REQUEST,
                true,
                true
            );
        }



        const imageUploadResult = await imageUpload.DynamicSignedURL(type, result.rows[0].user_create_order, loading_bilty_url, contentType);

        if (!imageUploadResult) {
            throw new APIError(
                "bilty image signed url are not found",
                httpStatus.BAD_REQUEST,
                true,
                true
            );
        }
        console.log("Image Upload Result:", imageUploadResult); // Debugging log
        return res.status(200).send({ sucsess: true, result: result.rows[0], image_url: imageUploadResult });

    } catch (error) {
        console.log("Error in driver_order_crate:", error); // Debugging log
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

async function driver_get_order_list(req, res, next) {

    try {
        const driver_id = req.user.id;
        const result = await pgClient.query("SELECT * FROM user_orders_list_get($1)", [driver_id]);

        if (!result.rows.length) {
            throw new APIError(
                "Order not createdd",
                httpStatus.BAD_REQUEST,
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

async function driver_get_order_id_details(req, res, next) {

    try {
        const { order_id } = req.body;

        const result = await pgClient.query("SELECT * FROM user_get_order_full_details($1)", [order_id]);

        if (!result.rows.length) {
            throw new APIError(
                "Order details are not found",
                httpStatus.BAD_REQUEST,
                true,
                true
            );
        }
        return res.status(200).send({ sucsess: true, result: result.rows[0] })
    } catch (error) {
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

async function driver_add_diesel(req, res, next) {

    try {
        const { diesel,order_id } = req.body;
        const driver_id = req.user.id;
        const result = await pgClient.query("SELECT * FROM user_add_diesel_to_order_time($1,$2)", [order_id, diesel ? JSON.stringify(diesel) : null]);

        if (!result.rows.length) {
            throw new APIError(
                "Order not createdd",
                httpStatus.BAD_REQUEST,
                true,
                true
            );
        }
        return res.status(200).send({ sucsess: true, result: result.rows[0] })
    } catch (error) {
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

async function driver_get_diesel_details(req, res, next) {

    try {
        const { order_id } = req.body;

        const result = await pgClient.query("SELECT * FROM get_diesel_details($1)", [order_id]);

        // if (!result.rows.length) {
        //     throw new APIError(
        //         "Order not createdd",
        //         httpStatus.BAD_REQUEST,
        //         true,
        //         true
        //     );
        // }
        return res.status(200).send({ sucsess: true, result: result.rows[0] })
    } catch (error) {
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

async function driver_update_details(req, res, next) {

    try {
        console.log("Request Body for update:", req.body); // Debugging log
        const { order_id, vehicle_id, transporter_id, transporter_name, total_loaded_weight, start_odometer, end_odometer, advance_bhada, other_kharch, vehicle_rate_per_ton, trip_allowance, labour, delivery, } = req.body;

        //const driver_id = req.user.id;

        const result = await pgClient.query("SELECT * FROM update_order_with_details($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", [
            order_id,
            vehicle_id,
            transporter_id,
            transporter_name,
            total_loaded_weight || 0,
            start_odometer || 0,
            end_odometer || 0,
            advance_bhada || 0,
            other_kharch || 0,
            vehicle_rate_per_ton || 0,
            trip_allowance || 0,
            labour ? JSON.stringify(labour) : null,
            delivery ? JSON.stringify(delivery) : null
        ]);

        return res.status(200).send({ sucsess: true, result: 'Update oreder sucessfull' });

    } catch (error) {
        const err =
            error.code === "22222"
                ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
                : new APIError(error.message || "Database query failed", 500, true, true);

        next(err);
    }

}

export default {
    get_vehicles_details: get_vehicles_details,
    get_labourers_details: get_labourers_details,
    get_items_details: get_items_details,
    get_customers_details: get_customers_details,
    driver_order_crate: driver_order_crate,
    driver_get_order_list: driver_get_order_list,
    driver_get_order_id_details: driver_get_order_id_details,
    driver_add_diesel: driver_add_diesel,
    driver_get_diesel_details: driver_get_diesel_details,
    driver_update_details: driver_update_details

};