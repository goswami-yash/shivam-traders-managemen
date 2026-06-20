import express from "express";

import adminservierCtrl from "../controllers/adminservice.js";
import passport from "../helpers/passport.js";

const router = express.Router();

//============================ DRIVER ============================//

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

//============================ VEHICLE ============================//

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
    "/vehicle/create",
    passport.isLoggedIn,
    adminservierCtrl.create_vehicle
);

//============================ CUSTOMER ============================//

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

//============================ SUPPLIER ============================//

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

//============================ ITEM ============================//

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

//============================ PLOT ============================//

router.post(
    "/plot/list",
    passport.isLoggedIn,
    adminservierCtrl.get_plot_details_list
);

router.post(
    "/plot/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_plot_details_by_id
);

router.post(
    "/plot/update",
    passport.isLoggedIn,
    adminservierCtrl.update_plot_details
);

router.post(
    "/plot/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_plot_by_id
);

router.post(
    "/plot/create",
    passport.isLoggedIn,
    adminservierCtrl.create_plot
);

//============================ PARTNER ============================//

router.post(
    "/partner/list",
    passport.isLoggedIn,
    adminservierCtrl.get_partner_details_list
);

router.post(
    "/partner/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_partner_details_by_id
);

router.post(
    "/partner/update",
    passport.isLoggedIn,
    adminservierCtrl.update_partner_details
);

router.post(
    "/partner/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_partner_by_id
);

router.post(
    "/partner/create",
    passport.isLoggedIn,
    adminservierCtrl.create_partner
);

//============================ TRANSPORTER ============================//

router.post(
    "/transporter/list",
    passport.isLoggedIn,
    adminservierCtrl.get_transporter_details_list
);

router.post(
    "/transporter/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_transporter_details_by_id
);

router.post(
    "/transporter/update",
    passport.isLoggedIn,
    adminservierCtrl.update_transporter_details
);

router.post(
    "/transporter/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_transporter_by_id
);

router.post(
    "/transporter/create",
    passport.isLoggedIn,
    adminservierCtrl.create_transporter
);

//============================ LABOURER ============================//

router.post(
    "/labourer/list",
    passport.isLoggedIn,
    adminservierCtrl.get_labourer_details_list
);

router.post(
    "/labourer/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_labourer_details_by_id
);

router.post(
    "/labourer/update",
    passport.isLoggedIn,
    adminservierCtrl.update_labourer_details
);

router.post(
    "/labourer/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_labourer_by_id
);

router.post(
    "/labourer/create",
    passport.isLoggedIn,
    adminservierCtrl.create_labourer
);

export default router;