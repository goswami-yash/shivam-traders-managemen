import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RedisStore } from 'connect-redis'; // Modern way
import compression from "compression";
import methodOverride from "method-override";
import httpStatus from "http-status";
import morgan from "morgan";
import { isCelebrateError } from 'celebrate';

// Internal Imports
import redisClient from '../config/redis.mjs';
import passport from './helpers/passport.js';
import routes from './routes/index.js';
import config from 'config';
import APIError from '../config/APIError.js';

const app = express();
const isDev = process.env.NODE_ENV !== "production";

// 1. Logging & Trust Proxy
if (isDev) {
    app.use(morgan("dev"));
} else {
    app.set("trust proxy", 1); // Crucial for secure cookies behind Nginx/Load Balancer
}

// 2. Global Security Headers
app.use(helmet({
    frameguard: { action: "deny" },
    contentSecurityPolicy: isDev ? false : undefined, // Enable real CSP in production
}));

// 3. CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:8081",
        "http://localhost:3001",
        "http://192.168.0.58:8081",
        "http://192.168.0.47:8081",
        "http://192.168.0.43:3001"
    ], 
    credentials: true
}));

// 4. Body Parsing & Performance
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(compression()); // Gzip compression
app.use(methodOverride());

// 5. Redis-Backed Session (Simplified for Connect-Redis v9)
app.use(session({
    store: new RedisStore({
        client: redisClient,
        prefix: "sess:",
    }),
    secret: config.get('App.config.sessionSecret'),
    resave: false,
    saveUninitialized: false,
    name: "logistics_sid", // Custom cookie name for security
    cookie: {
        secure: !isDev, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 Hours
        sameSite: isDev ? "lax" : "none", 
    }
}));

// 6. Auth Initialization
app.use(passport.initialize());
app.use(passport.session());

// 7. API Routes
app.use('/api', routes);

// 8. Error Handling - 404
app.use((req, res, next) => {
    next(new APIError("API Route Not Found", httpStatus.NOT_FOUND, true));
});

// 9. Error Handling - Validation & Global
app.use((err, req, res, next) => {
    // Handle Celebrate (Joi) Errors
    if (isCelebrateError(err)) {
        const messages = [];
        for (const [, joiError] of err.details.entries()) {
            messages.push(...joiError.details.map((e) => e.message));
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: messages.join(". "),
            error_type: "Validation_Error"
        });
    }

    // Handle Custom API Errors
    const status = err.status || 500;
    const response = {
        success: false,
        message: err.message || 'Internal Server Error',
    };

    if (isDev) {
        response.stack = err.stack;
    }

    res.status(status).json(response);
});

export default app;