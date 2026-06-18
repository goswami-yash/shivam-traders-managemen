import config from "config";
import pgClient from "../../config/db.js";
import httpStatus from "http-status";
import APIError from "../../config/APIError.js";
import haspassword from "../helpers/otp-email.js"


async function get_driver_details_list(req, res, next) {

    try {
        const { pagenumber, pagesize, search } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_get_driver_list($1,$2,$3)", [pagenumber, pagesize, search]);

        if (!result) {
            throw new APIError("The vehicles Details not found", httpStatus.NO_CONTENT, true, true);
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

async function create_driver(req, res, next) {

    try {

        const { name, mobile_no, password, email, license_no, aadhar_no, address, is_active } = req.body;

        const role = 'DRIVER';
        const user_id = req.user.id;


        const has_password = await haspassword.getHashPassword(password)

        const result = await pgClient.query("SELECT * FROM admin_create_users($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [user_id, name, mobile_no, has_password, role, email, license_no, aadhar_no, address, false, is_active]);

        if (!result) {
            throw new APIError(
                "The driver are not crated",
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

async function get_driver_details_by_id(req, res, next) {

    try {
        const { driver_id } = req.body;
        let result = await pgClient.query("SELECT * FROM admin_service_get_driver_details_by_id($1)", [driver_id]);

        if (!result) {
            throw new APIError(
                "The driver Details not found",
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

async function update_driver_details(req, res, next) {

    try {

        const { id, name, mobile_no, email, license_no, aadhar_no, address, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_update_driver_details($1,$2,$3,$4,$5,$6,$7,$8)", [id, name, mobile_no, email, license_no, aadhar_no, address, is_active]);

        if (!result) {
            throw new APIError(
                "The driver details are not update",
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

async function delete_driver_by_id(req, res, next) {

    try {
        const { driver_id } = req.body;
        let result = await pgClient.query("SELECT * FROM admin_service_delete_driver_by_id($1)", [driver_id]);

        if (!result) {
            throw new APIError(
                "The driver Details not found",
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

async function get_vehicle_details_list(req, res, next) {

    try {
        const { pagenumber, pagesize, search } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_get_vehicle_list($1,$2,$3)", [pagenumber, pagesize, search]);

        if (!result) {
            throw new APIError("The vehicles Details not found", httpStatus.NO_CONTENT, true, true
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

async function create_vehicle(req, res, next) {

    try {
        const user_id = req.user.id;
        const { vehicle_no, is_private, owner_name, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_create_vehicle_details($1,$2,$3,$4,$5)", [user_id, vehicle_no, is_private, owner_name, is_active]);

        if (!result) {
            throw new APIError("The vehicles are not Add", httpStatus.NO_CONTENT, true, true);
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

async function update_vehicle_details(req, res, next) {

    try {

        const { id, vehicle_no, is_private, owner_name, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_update_vehicle_details($1,$2,$3,$4,$5)", [id, vehicle_no, is_private, owner_name, is_active]);

        if (!result) {
            throw new APIError(
                "The vehicle details are not update",
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

async function get_vehicle_details_by_id(req, res, next) {

    try {
        const { vehicle_id } = req.body;

        let result = await pgClient.query("SELECT * FROM admin_service_get_vehicle_details_by_id($1)", [vehicle_id]);

        if (!result) {
            throw new APIError(
                "The vehicle Details not found",
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

async function delete_vehicle_by_id(req, res, next) {

    try {
        const { vehicle_id } = req.body;
        console
        let result = await pgClient.query("SELECT * FROM admin_service_delete_vehicle_by_id($1)", [vehicle_id]);

        if (!result) {
            throw new APIError(
                "The vehicle Details are not Delete",
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

async function get_customer_details_list(req, res, next) {

    try {
        const { pagenumber, pagesize, search } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_get_customer_list($1,$2,$3)", [pagenumber, pagesize, search]);

        if (!result) {
            throw new APIError("The vehicles Details not found", httpStatus.NO_CONTENT, true, true);
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

async function create_customer(req, res, next) {

    try {
        const user_id = req.user.id;
        const { name, mobile_no, email, company_name, customer_type, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_create_customer_details($1,$2,$3,$4,$5,$6,$7)", [user_id, name, mobile_no, email, company_name, customer_type, is_active]);

        if (!result) {
            throw new APIError("The customer are not Add", httpStatus.NO_CONTENT, true, true);
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

async function update_customer_details(req, res, next) {

    try {

        const { id, name, mobile_no, email, company_name, customer_type, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_update_customer_details($1,$2,$3,$4,$5,$6,$7) AS Update_customer", [id, name, mobile_no, email, company_name, customer_type, is_active]);

        if (!result || result.rows[0].Update_customer === false) {
            throw new APIError(
                "The vehicle details are not update",
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

async function get_customer_details_by_id(req, res, next) {

    try {
        const { customer_id } = req.body;

        let result = await pgClient.query("SELECT * FROM admin_service_get_customer_details_by_id($1)", [customer_id]);

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

async function delete_customer_by_id(req, res, next) {

    try {
        const { customer_id } = req.body;
        console
        let result = await pgClient.query("SELECT * FROM admin_service_delete_customer_by_id($1)", [customer_id]);

        if (!result) {
            throw new APIError(
                "The customer Details are not Delete",
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

async function get_supplier_details_list(req, res, next) {

    try {
        const { pagenumber, pagesize, search } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_get_supplier_list($1,$2,$3)", [pagenumber, pagesize, search]);

        if (!result) {
            throw new APIError("The supplier Details not found", httpStatus.NO_CONTENT, true, true);
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

async function create_supplier(req, res, next) {

    try {
        const user_id = req.user.id;
        const { name, mobile_no, email, company_name, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_create_supplier_details($1,$2,$3,$4,$5,$6)", [user_id, name, mobile_no, email, company_name, is_active]);

        if (!result) {
            throw new APIError("The customer are not Add", httpStatus.NO_CONTENT, true, true);
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

async function get_supplier_details_by_id(req, res, next) {

    try {
        const { supplier_id } = req.body;

        let result = await pgClient.query("SELECT * FROM admin_service_get_supplier_details_by_id($1)", [supplier_id]);

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

async function update_supplier_details(req, res, next) {

    try {

        const { id, name, mobile_no, email, company_name, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_update_supplier_details($1,$2,$3,$4,$5,$6) AS Update_supplier", [id, name, mobile_no, email, company_name, is_active]);

        if (!result || result.rows[0].Update_supplier === false) {
            throw new APIError(
                "The supplier details are not update",
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

async function delete_supplier_by_id(req, res, next) {

    try {
        const { supplier_id } = req.body;
        console
        let result = await pgClient.query("SELECT * FROM admin_service_delete_supplier_by_id($1)", [supplier_id]);

        if (!result) {
            throw new APIError(
                "The supplier Details are not Delete",
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

async function get_item_details_list(req, res, next) {

    try {
        const { pagenumber, pagesize, search } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_get_item_list($1,$2,$3)", [pagenumber, pagesize, search]);

        if (!result) {
            throw new APIError("The item Details not found", httpStatus.NO_CONTENT, true, true);
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

async function create_item(req, res, next) {

    try {
        const user_id = req.user.id;
        const { name, unit, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_create_item_details($1,$2,$3,$4)", [user_id, name, unit, is_active]);

        if (!result) {
            throw new APIError("The item are not Add", httpStatus.NO_CONTENT, true, true);
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

async function get_item_details_by_id(req, res, next) {

    try {
        const { item_id } = req.body;

        let result = await pgClient.query("SELECT * FROM admin_service_get_item_details_by_id($1)", [item_id]);

        if (!result) {
            throw new APIError(
                "The item Details not found",
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

async function update_item_details(req, res, next) {

    try {

        const { id, name, unit, is_active } = req.body;

        const result = await pgClient.query("SELECT * FROM admin_service_update_item_details($1,$2,$3,$4) AS Update_item", [id, name, unit, is_active]);

        if (!result || result.rows[0].Update_item === false) {
            throw new APIError(
                "The item details are not update",
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

async function delete_item_by_id(req, res, next) {

    try {
        const { item_id } = req.body;
        console
        let result = await pgClient.query("SELECT * FROM admin_service_delete_item_by_id($1)", [item_id]);

        if (!result) {
            throw new APIError(
                "The item Details are not Delete",
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

export default {
    get_driver_details_list,
    create_driver,
    get_driver_details_by_id,
    update_driver_details,
    delete_driver_by_id,
    get_vehicle_details_list,
    get_vehicle_details_by_id,
    update_vehicle_details,
    create_vehicle,
    delete_vehicle_by_id,
    create_customer,
    update_customer_details,
    get_customer_details_by_id,
    delete_customer_by_id,
    get_customer_details_list,
    create_supplier,
    get_supplier_details_by_id,
    update_supplier_details,
    delete_supplier_by_id,
    get_supplier_details_list,
    get_item_details_list,
    create_item,
    get_item_details_by_id,
    update_item_details,
    delete_item_by_id
}