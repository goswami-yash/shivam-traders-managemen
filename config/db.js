import pg from "pg";
import { errorHandler } from "./dbError.js";   // ✅ FIXED
import config from 'config';


// Create pool
const pool = new pg.Pool({
    
    host: config.get('App.db.host'),///145.223.21.90
    user: config.get('App.db.user'),
    password: config.get('App.db.password'),
    database: config.get('App.db.name'),
    port:  config.get('App.db.port'),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 1000 * 120,
    ssl: config.get("App.config.database.ssl")
    ? { rejectUnauthorized: false }
    : false
});

//console.log("db",pool.options);
// Fix bigint parsing
pg.types.setTypeParser(20, (value) => parseInt(value, 10));

const pgClient = {
    query: async function (text, values) {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query(text, values);
            return result;
        } catch (err) {
            throw errorHandler(err.code, err.message, err.constraint);  // ✅ FIXED
        } finally {
            if (client) client.release();
        }
    },

    getRowsQuery: async function (text, values, key) {
        const result = await this.query(text, values);
        return key ? result.rows[0]?.[key] : result.rows;
    }
};

export default pgClient;
