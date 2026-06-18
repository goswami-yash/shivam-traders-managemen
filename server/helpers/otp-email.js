import config from "config";
import bcrypt from 'bcrypt';

const saltRounds = 10;

async function getHashPassword(password) {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash
    } catch (error) {
      throw error;
    }
  }

  export default {getHashPassword}