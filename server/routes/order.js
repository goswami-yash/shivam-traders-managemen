import express from "express";

import orderCtrl from "../controllers/order.js";
import passport from "../helpers/passport.js";

const router = express.Router();

// Login route
router.get(
    "/get/vehicles",
    //passport.isLoggedIn,
    orderCtrl.get_vehicles_details
);

router.get(
    "/get/labourers",
    //passport.isLoggedIn,
    orderCtrl.get_labourers_details
);

router.get(
    "/get/items",
    //passport.isLoggedIn,
    orderCtrl.get_items_details
);

router.get(
    "/get/customers",
    //passport.isLoggedIn,
    orderCtrl.get_customers_details
);

router.post(
    "/create",
    //passport.isLoggedIn,
    orderCtrl.driver_order_crate
);

router.get(
    "/get/list",
    //passport.isLoggedIn,
    orderCtrl.driver_get_order_list
);

router.post(
    "/get/order/details",
    passport.isLoggedIn,
    orderCtrl.driver_get_order_id_details
);//order/diesel/labour/delivery

router.post(
    "/add/diesel/details",
    //passport.isLoggedIn,
    orderCtrl.driver_add_diesel
);

router.post(
    "/get/diesel/details",
    //passport.isLoggedIn,
    orderCtrl.driver_get_diesel_details
);

router.post(
    "/update/details",
    //passport.isLoggedIn,
    orderCtrl.driver_update_details
);
export default router;