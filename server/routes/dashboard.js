import express from "express";
import { celebrate,Segments } from "celebrate";
import paramValidation from '../validations/login.js';
import dashboardCtrl from '../controllers/dashboard.js';
import passport from "../helpers/passport.js";

const router = express.Router();

// Login route
router.get(
    "/driver/get",
    //passport.isLoggedIn,
    dashboardCtrl.driver_order_time_details
  );

  router.post(
    "/driver/create-order",
    //passport.isLoggedIn,
    dashboardCtrl.driver_order_crate
  );

  export default router;