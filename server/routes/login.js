import express from "express";
import { celebrate,Segments } from "celebrate";
import paramValidation from '../validations/login.js';
import loginCtrl from '../controllers/login.js';
import passport from "../helpers/passport.js";

const router = express.Router();

// Login route
router.post(
    "/login/",
    celebrate({ [Segments.BODY]: paramValidation.loginUser.body }),
    passport.authenticate("local"),
    loginCtrl.loginUser
  );


router.get("/logout",loginCtrl.logout);

  export default router;