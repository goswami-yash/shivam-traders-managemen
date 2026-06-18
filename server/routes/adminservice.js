import express from "express";

import adminservierCtrl from "../controllers/adminservice.js";
import passport from "../helpers/passport.js";

const router = express.Router();

router.post(
    "/driver/create",
    passport.isLoggedIn,
    adminservierCtrl.create_driver
);

router.post(
    "/driver/list",
    passport.isLoggedIn,
    adminservierCtrl.get_driver_details_list
);

router.post(
    "/driver/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_driver_details_by_id
);


router.post(
    "/driver/update",
    passport.isLoggedIn,
    adminservierCtrl.update_driver_details
);


router.post(
    "/driver/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_driver_by_id
);

router.post(
    "/vehicle/list",
    passport.isLoggedIn,
    adminservierCtrl.get_vehicle_details_list
);

router.post(
    "/vehicle/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_vehicle_details_by_id
);


router.post(
    "/vehicle/update",
    passport.isLoggedIn,
    adminservierCtrl.update_driver_details
);


router.post(
    "/vehicle/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_vehicle_by_id
);

router.post(
    "/vehicle/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_vehicle_by_id
);

router.post(
    "/vehicle/create",
    passport.isLoggedIn,
    adminservierCtrl.create_vehicle
);

router.post(
    "/customer/list",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_details_list
);

router.post(
    "/customer/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_details_by_id
);


router.post(
    "/customer/update",
    passport.isLoggedIn,
    adminservierCtrl.update_customer_details
);


router.post(
    "/customer/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_customer_by_id
);

router.post(
    "/customer/create",
    passport.isLoggedIn,
    adminservierCtrl.create_customer
);

router.post(
    "/supplier/list",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_details_list
);

router.post(
    "/supplier/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_details_by_id
);


router.post(
    "/supplier/update",
    passport.isLoggedIn,
    adminservierCtrl.update_supplier_details
);


router.post(
    "/supplier/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_supplier_by_id
);

router.post(
    "/supplier/create",
    passport.isLoggedIn,
    adminservierCtrl.create_supplier
);

router.post(
    "/item/list",
    passport.isLoggedIn,
    adminservierCtrl.get_item_details_list
);

router.post(
    "/item/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_item_details_by_id
);


router.post(
    "/item/update",
    passport.isLoggedIn,
    adminservierCtrl.update_item_details
);


router.post(
    "/item/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_item_by_id
);

router.post(
    "/item/create",
    passport.isLoggedIn,
    adminservierCtrl.create_item
);
export default router ;