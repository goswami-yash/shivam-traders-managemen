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
  const userPassword = req.body.password;

  try {
    const result = await pgClient.query("SELECT * FROM login_get_user_by_mobile($1)",[mobileNo]);

    const dbPassword = result.rows[0].password;

    const isPasswordMatch = await comparePassword(userPassword, dbPassword);

    if (!isPasswordMatch) {
        throw new APIError(
          "Incorrect username password.",
          httpStatus.UNAUTHORIZED,
          true,
          true
        );
      }

      
    
  } catch (error) {
    const err =
    error.code === "22222"
      ? new APIError(error.message, httpStatus.NOT_FOUND, true, true)
      : new APIError(error.message || "Database query failed", 500, true, true);

  next(err);
  }
}