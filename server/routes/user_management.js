import express from "express";

import userManageCtrl from "../controllers/user_management.js";
import passport from "../helpers/passport.js";

const router = express.Router();

// Login route
router.post(
    "/get/user/list",
    //passport.isLoggedIn,
    userManageCtrl.get_users_details_list
);

router.post(
    "/get/driver/list",
    //passport.isLoggedIn,
    userManageCtrl.get_driver_details_list
);

export default router;