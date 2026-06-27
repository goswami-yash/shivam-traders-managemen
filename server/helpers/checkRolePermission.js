import redisClient from '../../config/redis.mjs';

import httpStatus from "http-status";

function checkRolePermission(permission_array) {
  return async function (req, res, next) {
    try {
      const role_id = req.user.role_id; // assuming passport sets req.user

      const data = await redisClient.hGet("role_permission", String(role_id));

      if (!data) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ success: false, message: "Not Authorized." });
      }

      const permissions = JSON.parse(data);

      const allowed = permission_array.some(p => permissions.includes(p));

      if (allowed) {
        return next();
      } else {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ success: false, message: "Not Authorized." });
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = checkRolePermission;
