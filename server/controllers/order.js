import pgClient from "../../config/db.js";

import httpStatus from "http-status";
import config from "config";
import APIError from "../../config/APIError.js";
import imageUpload from "../helpers/image_uploed.js";

async function get_vehicles_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_vehicles_details()", []);

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

async function get_driver_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_driver_details()", []);

        if (!result) {
            throw new APIError(
                "The Driver Details not found",
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
        const result = await pgClient.query("SELECT * FROM user_order_time_get_labourers_details()", []);

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
        const result = await pgClient.query("SELECT * FROM user_order_time_get_item_details()", []);

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

async function get_supplier_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_supplier_details()", []);

        if (!result) {
            throw new APIError(
                "The supplier Details not found",
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

async function get_supplier_address_details(req, res, next) {

    const supplier_id = req.body.supplier_id;

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_supplier_address_details($1)", [supplier_id]);

        if (!result) {
            throw new APIError(
                "The supplier Details not found",
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

async function get_supplier_item_price_details(req, res, next) {

    const supplier_id = req.body.supplier_id;

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_supplier_item_price_details($1)", [supplier_id]);

        if (!result) {
            throw new APIError(
                "The supplier Details not found",
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

async function get_supplier_payments_details(req, res, next) {

    const supplier_id = req.body.supplier_id;

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_supplier_payments_details($1)", [supplier_id]);

        if (!result) {
            throw new APIError(
                "The supplier Details not found",
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
        const result = await pgClient.query("SELECT * FROM user_order_time_get_customer_details()", []);

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

async function get_customers_address_details(req, res, next) {

    const customer_id = req.body.customer_id;

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_customer_address_details($1)", [customer_id]);

        if (!result) {
            throw new APIError(
                "The customer Details not found",
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

async function get_customers_item_price_details(req, res, next) {

    const customer_id = req.body.customer_id;

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_customer_item_price_details($1)", [customer_id]);

        if (!result) {
            throw new APIError(
                "The customer Details not found",
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

async function get_customers_payments_details(req, res, next) {

    const customer_id = req.body.customer_id;

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_customer_payments_details($1)", [customer_id]);

        if (!result) {
            throw new APIError(
                "The customer Details not found",
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

async function get_partners_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_order_time_get_partner_details()", []);

        if (!result) {
            throw new APIError(
                "The partners Details not found",
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

        // Debugging log
        const {
            vehicle_number,
            driver_name,
            total_loaded_weight,
            total_delivery_weight,
            is_private,
            start_date,
            start_odometer,
            end_date,
            end_odometer,
            advance_bhada,
            remaining_bhada,
            total_bhada,
            other_kharch,
            vehicle_rate_per_ton,
            trip_allowance,
            transporter_name,
            partner_name,
            loading_bilty_url,
            contentType,
            labour,
            delivery,
            purchase
        } = req.body;

        //const driver_id = req.user.id;
        console.log("Request Body for create order:", req.body);
        //console.log("Request Body:", req.body); // Debugging log
        //console.log("Driver ID:", driver_id); // Debugging log
        const type = "bilty_img";
        const result = await pgClient.query("SELECT * FROM user_create_order($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)", [
            vehicle_number,
            driver_name,
            total_loaded_weight,
            total_delivery_weight,
            is_private,
            start_date,
            start_odometer || 0,
            end_date,
            end_odometer || 0,
            advance_bhada || 0,
            remaining_bhada || 0,
            total_bhada || 0,
            other_kharch || 0,
            vehicle_rate_per_ton || 0,
            trip_allowance || 0,
            transporter_name || null,
            partner_name || null,
            loading_bilty_url,
            purchase ? JSON.stringify(purchase) : null,
            delivery ? JSON.stringify(delivery) : null,
            labour ? JSON.stringify(labour) : null
        ]);

        //console.log("Database Result:", result); // Debugging log
        console.log("Database Result:", result.rows); // Debugging log
        if (
            !result.rows[0] ||
            result.rows[0].user_create_order.success === false
        ) {
            throw new APIError(
                result.rows[0]?.user_create_order?.message || "Order not created",
                httpStatus.BAD_REQUEST,
                true,
                true
            );
        }


        const imageUploadResult = await imageUpload.DynamicSignedURL(type, result.rows[0].user_create_order.order_number, loading_bilty_url, contentType);

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

        const result = await pgClient.query("SELECT * FROM user_orders_list_get()", []);

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
        const { diesel, order_id } = req.body;
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
        const { order_number, vehicle_number, driver_name, total_loaded_weight, total_delivery_weight , transporter_name, start_date, start_odometer, end_date, end_odometer, advance_bhada, remaining_bhada, total_bhada, other_kharch, vehicle_rate_per_ton, trip_allowance, private_vehicle, partner_name, loading_bilty_url, labour, delivery, purchase,contentType
        } = req.body;

        //const driver_id = req.user.id;

        const result = await pgClient.query("SELECT * FROM user_update_order($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)", [
            order_number,
            vehicle_number,
            driver_name,
            total_loaded_weight,
            total_delivery_weight,
            private_vehicle,
            start_date,
            start_odometer || 0,
            end_date,
            end_odometer || 0,
            advance_bhada || 0,
            remaining_bhada || 0,
            total_bhada || 0,
            other_kharch || 0,
            vehicle_rate_per_ton || 0,
            trip_allowance || 0,
            transporter_name,
            partner_name,
            loading_bilty_url,
            purchase ? JSON.stringify(purchase) : null,
            delivery ? JSON.stringify(delivery) : null,
            labour ? JSON.stringify(labour) : null
        ]);

        console.log("result",result.rows[0].user_update_order)
        if(!result || result.rows.length === 0){
            throw new APIError('the order not sucess',httpStatus.BAD_REQUEST,true,true);
        }
        let imageUploadResult = null ;
if( !loading_bilty_url == loading_bilty_url){

    const type = "bilty_img";

    let imageUploadResult = await imageUpload.DynamicSignedURL(type,order_number, loading_bilty_url, contentType);

    if (!imageUploadResult) {
        throw new APIError(
            "bilty image signed url are not found",
            httpStatus.BAD_REQUEST,
            true,
            true
        );
    }

}
        return res.status(200).send({ sucsess: true, result: 'Update oreder sucessfull' ,imageUpload : false , image_url: imageUploadResult });

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
    get_driver_details: get_driver_details,
    get_labourers_details: get_labourers_details,
    get_items_details: get_items_details,
    get_customers_details: get_customers_details,
    driver_order_crate: driver_order_crate,
    driver_get_order_list: driver_get_order_list,
    driver_get_order_id_details: driver_get_order_id_details,
    driver_add_diesel: driver_add_diesel,
    driver_get_diesel_details: driver_get_diesel_details,
    driver_update_details: driver_update_details,
    get_supplier_details: get_supplier_details,
    get_supplier_address_details: get_supplier_address_details,
    get_supplier_item_price_details: get_supplier_item_price_details,
    get_supplier_payments_details: get_supplier_payments_details,
    get_customers_address_details: get_customers_address_details,
    get_customers_item_price_details: get_customers_item_price_details,
    get_customers_payments_details: get_customers_payments_details,
    get_partners_details: get_partners_details

};