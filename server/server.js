import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './helpers/passport.js';
import logger from "morgan";
import compress from "compression";
import methodOverride from "method-override";
import { status } from "http-status";
import routes from './routes/index.js';
import config from 'config';
import APIError from '../config/APIError.js';
import { isCelebrateError } from 'celebrate';
import { RedisStore } from "connect-redis";


let redisClient = null;
let getConnectionStatus = null;
let healthCheck = null;



// Promise to track Redis module initialization
let redisInitPromise = null;



// Function to initialize Redis module (can be called from index.js)
const initializeRedis = async () => {
  if (redisInitPromise) {
    return redisInitPromise;
  }

  
  redisInitPromise = (async () => {
    try {
      const redisModule = await import("../config/redis.mjs");
      redisClient = redisModule.default;
      console.log("redis",redisClient)
      getConnectionStatus = redisModule.getConnectionStatus;
      healthCheck = redisModule.healthCheck;
      return { redisClient, getConnectionStatus, healthCheck };
    } catch (err) {
      console.error("Failed to import Redis module:", err);
      throw err;
    }
  })();

  return redisInitPromise;
};

// Note: Redis initialization is handled by index.js via app.initializeRedis()
// We don't start it here to avoid race conditions - index.js will await it properly



// ============================================
// Redis Connection Validation and Store Creation
// ============================================
let store = undefined; // undefined = not initialized, null = initialized but not available

// Function to check Redis connection and create/store RedisStore with retry logic
// This will be called lazily when store is first accessed
const getRedisStore = async (retryCount = 0) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1000; // Start with 1 second

  // If store already initialized and valid, return it
  if (store !== undefined && store !== null) {
    console.log("==========================================");
    console.log("Session Store Type: RedisStore (already initialized)");
    console.log("==========================================");
    return store;
  }

  // Wait for Redis module to be initialized if still loading
  if (!redisClient && redisInitPromise) {
    try {
      await redisInitPromise;
    } catch (err) {
      // Redis init failed, will be handled below
    }
  }

  // Try to get connection status
  let status = null;
  try {
    if (getConnectionStatus) {
      status = getConnectionStatus();
    }
  } catch (err) {
    // getConnectionStatus not available yet
  }

  if (!redisClient) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount); // Exponential backoff
      console.warn(`==========================================`);
      console.warn(`Redis: Client not initialized - Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      console.warn(`==========================================`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getRedisStore(retryCount + 1);
    }
    console.warn("==========================================");
    console.warn("Redis: Client not initialized after retries - RedisStore creation skipped");
    console.warn("Sessions will fall back to memory store");
    console.warn("Session Store Type: MemoryStore");
    console.warn("==========================================");
    store = null;
    return store;
  }

  // Check connection status
  if (!status || !status.connected) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      console.warn(`==========================================`);
      console.warn(`Redis: Not connected - Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      console.warn(`Connection Status: ${status ? JSON.stringify(status) : "Unknown"}`);
      console.warn(`==========================================`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getRedisStore(retryCount + 1);
    }
    console.warn("==========================================");
    console.warn("Redis: Not connected after retries - RedisStore creation skipped");
    console.warn("Connection Status:", status ? JSON.stringify(status) : "Unknown");
    console.warn("Sessions will fall back to memory store");
    console.warn("Session Store Type: MemoryStore");
    console.warn("==========================================");
    store = null;
    return store;
  }

  try {
    const redisStore = new RedisStore({
      client: redisClient,
      prefix: "sess:", // or any prefix *matching* your cookie format
    });

    console.log("==========================================");
    console.log("Redis: RedisStore created successfully");
    console.log(`Host: ${status.host}:${status.port}`);
    console.log(`Database: ${status.database}`);
    console.log("Session Store Type: RedisStore");
    console.log("==========================================");

    store = redisStore;
    return store;
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      console.warn(`==========================================`);
      console.warn(`Redis: Failed to create RedisStore - Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      console.warn(`Error: ${err.message}`);
      console.warn(`==========================================`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return getRedisStore(retryCount + 1);
    }
    console.error("==========================================");
    console.error("Redis: Failed to create RedisStore after retries");
    console.error(`Error: ${err.message}`);
    console.error("Sessions will fall back to memory store");
    console.error("Session Store Type: MemoryStore");
    console.error("==========================================");
    store = null;
    return store;
  }
};

// ============================================
// Redis Connection Status Middleware
// ============================================
// Middleware to check Redis connection status and log warnings during session operations
const redisConnectionStatusMiddleware = async (req, res, next) => {
  // Initialize store if not already done (with retry logic)
  if (store === undefined) {
    await getRedisStore();
  }

  // Check connection status during session operations
  if (store && redisClient && getConnectionStatus) {
    try {
      const status = getConnectionStatus();
      if (!status || !status.connected) {
        console.warn("==========================================");
        console.warn("Redis: Connection lost during session operation");
        console.warn(`Request: ${req.method} ${req.url}`);
        console.warn("Session operations may fail or fall back to memory store");
        console.warn("==========================================");
      }
    } catch (err) {
      // getConnectionStatus may not be available yet
    }
  }
  next();
};

const app = express();

// ============================================
// X-Forwarded-Proto & HTTPS Handling
// ============================================
// Trust proxy to correctly handle X-Forwarded-Proto header from ALB/CloudFront/Nginx
app.set('trust proxy', true);

/**
 * Helper function to determine if the request is secure (HTTPS)
 * Works in all environments: dev (direct HTTP/HTTPS), staging, production (behind ALB/CloudFront)
 * Checks both req.secure (set by Express when trust proxy is enabled) and X-Forwarded-Proto header
 */
function isSecureRequest(req) {
  // req.secure is automatically set to true by Express when:
  // 1. Direct HTTPS connection, OR
  // 2. trust proxy is enabled AND X-Forwarded-Proto: https header is present
  if (req.secure) return true;

  // Fallback: explicitly check X-Forwarded-Proto header
  const xfProto = (req.headers['x-forwarded-proto'] || '').toString().toLowerCase();
  return xfProto === 'https';
}

/**
 * Optional HTTPS redirect middleware
 * Only enforces HTTPS when ENFORCE_HTTPS env var is set to 'true'
 * Works in all environments - can be enabled/disabled per environment
 */
const enforceHttps = process.env.ENFORCE_HTTPS === 'true';
if (enforceHttps) {
  app.use((req, res, next) => {
    if (isSecureRequest(req)) {
      return next(); // Already HTTPS, continue
    }

    // Redirect HTTP to HTTPS
    const host = req.headers.host || req.get('host');
    const url = `https://${host}${req.originalUrl}`;
    return res.redirect(301, url);
  });
}

// CORS allowlist helpers
const wildcardGsebRegex = /^https?:\/\/[^.]+\.gsebht\.in\/?$/i;
const wildcardCloudfrontRegex = /^https?:\/\/[^.]+\.cloudfront\.net\/?$/i;
const staticOrigins = [
  // Local dev
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:80",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
  // LAN IPs
  "http://192.168.1.66:8080",
  "http://192.168.1.66:80",
  "http://192.168.1.65:8080"
];

const buildAllowedOrigins = () => {
  const origins = new Set(staticOrigins);


  if (process.env.ALB_DNS_NAME) {
    origins.add(`https://${process.env.ALB_DNS_NAME}`);
    origins.add(`http://${process.env.ALB_DNS_NAME}`);
  }

  if (process.env.FRIENDLY_DOMAINS) {
    process.env.FRIENDLY_DOMAINS.split(",")
      .map((d) => d.trim())
      .filter(Boolean)
      .forEach((d) => origins.add(d));
  }

  return new Set(origins);
};

const allowedOrigins = buildAllowedOrigins();

// const httpRequestDurationMicroseconds = new Prometheus.Histogram({
//   name: 'http_request_duration_ms',
//   help: 'Duration of HTTP requests in ms',
//   labelNames: ['method', 'route', 'code'],
//   buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
// });

// Runs before each requests
// app.use((req, res, next) => {
//   res.locals.startEpoch = Date.now();
//   next();
// })

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow tools like curl/Postman with no origin
      if (!origin) return callback(null, true);

      // Localhost patterns
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("http://192.168.")
      ) {
        return callback(null, true);
      }

      // Exact allowlist
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      // Wildcard subdomains of gsebht.in or CloudFront distributions
      if (wildcardGsebRegex.test(origin)) {
        return callback(null, true);
      }
      if (wildcardCloudfrontRegex.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);


if (app.get("env") === "development") {
  app.use(logger("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Dynamic session cookie configuration
 * Secure flag is set based on:
 * 1. Environment (production/staging should use secure cookies when HTTPS)
 * 2. Actual request protocol (checks X-Forwarded-Proto when behind proxy)
 * 
 * This ensures cookies work correctly in:
 * - Development: HTTP only (secure: false) - cookies work over HTTP
 * - Staging: HTTP or HTTPS (secure: false for HTTP, secure: true for HTTPS via X-Forwarded-Proto)
 * - Production: HTTPS only (secure: true via X-Forwarded-Proto)
 */
const isProd = app.get("env") === "production";
const isStaging = app.get("env") === "staging";

// Base cookie configuration
const baseSessionCookie = {
  maxAge: 60 * 60 * 1 * 1000, // 1 hour
  httpOnly: true,
  sameSite: "lax",
  path: "/",
};

// Session middleware with dynamic secure cookie flag
// Add Redis connection status check before session middleware
app.use(redisConnectionStatusMiddleware);

let sessionMiddleware = null;

app.use(async (req, res, next) => {
  if (store === undefined) {
    await getRedisStore();
  }


  if (!sessionMiddleware) {
    const sessionStore = store || undefined;
    const secureCookie = (isProd || isStaging) ? true : false;

    sessionMiddleware = session({
      store: sessionStore,
      name: "Shivam_Traders", // unique to admin app
      secret: config.get('App.config.sessionSecret'),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        ...baseSessionCookie,
        secure: secureCookie,
      },
    });
  }

  sessionMiddleware(req, res, next);
});

app.use((req, res, next) => {
    console.log('========================================');
    console.log('URL:', req.method, req.originalUrl);
    console.log('RAW COOKIE:', req.headers.cookie);
    console.log('SESSION ID:', req.sessionID);
    console.log('SESSION PASSPORT:', req.session?.passport);
    console.log('========================================');

    next();
});
app.use(passport.initialize());
app.use((req, res, next) => {

    console.log('========== BEFORE PASSPORT SESSION ==========');

    console.log('SESSION ID:', req.sessionID);

    console.log(
        'SESSION PASSPORT:',
        req.session?.passport
    );

    console.log(
        'SESSION:',
        req.session
    );

    next();
});
app.use(passport.session());

app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(
  helmet({
    frameguard: {
      action: "deny",
    },
  })
);


// mount all routes on /api path
app.use('/api', routes);


// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    // Flatten Celebrate error messages
    const errorMessages = [];

    for (const [segment, joiError] of err.details.entries()) {
      const segmentMessages = joiError.details.map((detail) => detail.message);
      errorMessages.push(...segmentMessages);
    }

    const unifiedErrorMessage = errorMessages.join(". ");
    const error = new APIError(unifiedErrorMessage, 400, true);
    return next(error);
  }

  if (!(err instanceof APIError)) {
    const apiError = new APIError(
      err.message,
      err.status || 500,
      err.isPublic || false
    );
    return next(apiError);
  }

  return next(err);
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError("API not found", status.NOT_FOUND, true);
  return next(err);
});



// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  const isDev = app.get("env") === "development";

  if (isDev) {
    console.error(err.stack); // log it
  }

  res.status(err.status).json({
    success: false,
    message: err.isPublic
      ? err.message
      : "Something Went wrong.Please try again!",
  });
});

export default app ;
export { initializeRedis, getRedisStore };
