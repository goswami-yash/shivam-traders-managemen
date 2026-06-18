import express from "express";
import loginRoutes from "./login.js";
import dashboardRoutes from "./dashboard.js";
import orderRoutes from "./order.js";
import userManageRoutes from "./user_management.js";
import adminRoutes from "./adminservice.js";

const router = express.Router();


router.get("/health-check", (req, res) => res.send("OK"));
router.use("/auth", loginRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/order", orderRoutes);
router.use("/user/manage",userManageRoutes);
router.use("/admin",adminRoutes);


export  default router;