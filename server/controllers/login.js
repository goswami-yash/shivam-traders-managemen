import pgClient from "../../config/db.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "config";
import APIError from "../../config/APIError.js";


// compare password
async function comparePassword(userPassword, dbPassword) {
    try {
      return await bcrypt.compare(userPassword, dbPassword);
    } catch (error) {
      throw error;
    }
  }

async function loginUser(req,res,next){
  const mobileNo = req.body.mobile_no ;
  console.log("mobile:",mobileNo)
  try {
    const result = await pgClient.query("SELECT * FROM login_get_user_by_mobile($1)",
      [mobileNo]
  );
  const user = result.rows[0];
  await delete user.password;
      return res.status(200).send({success : true , message :"Login Successful",result : user});
    
  } catch (error) {
    const err =
    error.code === "22222"
      ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
      : new APIError(error.message || "Database query failed", 500, true, true);

  next(err);
  }
}

async function logout(req, res, next) {
  try {
    // Convert session.destroy (callback API) → async/await safe
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    //2. Logout passport (IMPORTANT)
    req.logout(() => {});

    // 3. Clear cookie from browser
    res.clearCookie("Shivam_Traders", {
      path: "/",
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax", // must match your session config
    });

  res.send({success : true , message : "Logout successfully"})

  } catch (error) {
    next(error);
  }
}

export default {comparePassword,loginUser,logout};