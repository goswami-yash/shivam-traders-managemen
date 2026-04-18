import pgClient from "../../config/db.js";

import httpStatus from "http-status";
import config from "config";
import APIError from "../../config/APIError.js";


async function driver_order_time_details(req, res, next) {

    try {
        const result = await pgClient.query("SELECT * FROM user_get_order_time_details()", []);

        if (!result) {
            throw new APIError(
                      "The Order Details not found",
                      httpStatus.NO_CONTENT,
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

async function driver_order_crate(req, res, next) {

    try {
        const {
            vehicle_id ,
            driver_id ,
            total_loaded_weight ,
            loading_bilty_url ,
            start_odometer ,
            end_odometer ,
            advance_bhada ,
            other_kharch ,
            vehicle_rate_per_ton ,
            trip_allowance ,
            transporter_id ,
            transporter_name ,
            labour ,
            delivery
         }=req.body ;

        // const driver_id = req.user.id ;
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

export default { driver_order_time_details ,driver_order_crate};