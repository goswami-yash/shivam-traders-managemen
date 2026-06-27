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
    adminservierCtrl.update_vehicle_details
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

router.get(
    "/transporter/name/list",
    passport.isLoggedIn,
    adminservierCtrl.get_transporter_name_list
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


//============================ CUSTOMER ADDRESS ============================//

router.post(
    "/customer/address/list",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_address_details_list
);

router.post(
    "/customer/address/update",
    passport.isLoggedIn,
    adminservierCtrl.update_customer_address_details
);

router.post(
    "/customer/address/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_customer_address_by_id
);

router.post(
    "/customer/address/create",
    passport.isLoggedIn,
    adminservierCtrl.create_customer_address
);

router.post(
    "/customer/address/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_address_details_by_id
);

//============================ CUSTOMER PAYMENT ============================//

router.post(
    "/customer/payment/list",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_payment_details_list
);

router.post(
    "/customer/payment/update",
    passport.isLoggedIn,
    adminservierCtrl.update_customer_payment_details
);

router.post(
    "/customer/payment/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_customer_payment_by_id
);

router.post(
    "/customer/payment/create",
    passport.isLoggedIn,
    adminservierCtrl.create_customer_payment
);

router.post(
    "/customer/payment/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_payment_details_by_id
);


//============================ CUSTOMER ITEM PRICE ============================//

router.post(
    "/customer/item/price/list",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_item_price_details_list
);

router.post(
    "/customer/item/price/update",
    passport.isLoggedIn,
    adminservierCtrl.update_customer_item_price_details
);

router.post(
    "/customer/item/price/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_customer_item_price_by_id
);

router.post(
    "/customer/item/price/create",
    passport.isLoggedIn,
    adminservierCtrl.create_customer_item_price
);

router.post(
    "/customer/item/price/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_customer_item_price_details_by_id
);

//============================ LABOURER ASSIGN PLOT ============================//

router.post(
    "/labourer/assign/plot/list",
    passport.isLoggedIn,
    adminservierCtrl.get_labourer_assign_plot_details_list
);

router.post(
    "/labourer/assign/plot/update",
    passport.isLoggedIn,
    adminservierCtrl.update_labourer_assign_plot_details
);

router.post(
    "/labourer/assign/plot/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_labourer_assign_plot_by_id
);

router.post(
    "/labourer/assign/plot/create",
    passport.isLoggedIn,
    adminservierCtrl.create_labourer_assign_plot
);

router.post(
    "/labourer/assign/plot/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_labourer_assign_plot_details_by_id
);

//============================ SUPPLIER ADDRESS ============================//

router.post(
    "/supplier/address/list",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_address_details_list
);

router.post(
    "/supplier/address/update",
    passport.isLoggedIn,
    adminservierCtrl.update_supplier_address_details
);

router.post(
    "/supplier/address/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_supplier_address_by_id
);

router.post(
    "/supplier/address/create",
    passport.isLoggedIn,
    adminservierCtrl.create_supplier_address
);

router.post(
    "/supplier/address/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_address_details_by_id
);


//============================ CUSTOMER PAYMENT ============================//

router.post(
    "/supplier/payment/list",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_payment_details_list
);

router.post(
    "/supplier/payment/update",
    passport.isLoggedIn,
    adminservierCtrl.update_supplier_payment_details
);

router.post(
    "/supplier/payment/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_supplier_payment_by_id
);

router.post(
    "/supplier/payment/create",
    passport.isLoggedIn,
    adminservierCtrl.create_supplier_payment
);

router.post(
    "/supplier/payment/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_payment_details_by_id
);

//============================ SUPPLIER ITEM PRICE ============================//

router.post(
    "/supplier/item/price/list",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_item_price_details_list
);

router.post(
    "/supplier/item/price/update",
    passport.isLoggedIn,
    adminservierCtrl.update_supplier_item_price_details
);

router.post(
    "/supplier/item/price/delete",
    passport.isLoggedIn,
    adminservierCtrl.delete_supplier_item_price_by_id
);

router.post(
    "/supplier/item/price/create",
    passport.isLoggedIn,
    adminservierCtrl.create_supplier_item_price
);

router.post(
    "/supplier/item/price/details/by_id",
    passport.isLoggedIn,
    adminservierCtrl.get_supplier_item_price_details_by_id
);

export default router;