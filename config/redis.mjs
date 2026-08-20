/**
 * Industry-Standard Redis Client for AWS ElastiCache
 * 
 * Features:
 * - AWS ElastiCache compatible
 * - Environment variable based configuration
 * - Exponential backoff reconnection strategy
 * - Comprehensive error handling
 * - Production-ready logging for ECS
 * - Common file for all backend services
 * 
 * Configuration:
 * - REDIS_HOST: Redis hostname (from custom-environment-variables.json -> App.redis.host)
 * - REDIS_PORT: Redis port (from custom-environment-variables.json -> App.redis.port)
 * - REDIS_DB: Redis database number (optional, defaults to 14)
 */

import { createClient } from 'redis';
import config from 'config';

// ============================================
// Configuration
// ============================================
const REDIS_DB = parseInt(process.env.REDIS_DB || '14', 10);
const CONNECT_TIMEOUT = 10000; // 10 seconds
const MAX_RECONNECT_DELAY = 30000; // 30 seconds max delay
const INITIAL_RECONNECT_DELAY = 100; // 100ms initial delay
const MAX_RECONNECT_ATTEMPTS = Infinity; // Infinite retries with backoff
const MAX_INITIAL_CONNECT_WAIT_TIME = parseInt(process.env.REDIS_MAX_INITIAL_CONNECT_WAIT_TIME || '30000', 10); // 30 seconds default

// ============================================
// Get Redis Configuration
// ============================================
let redisHost = null;
let redisPort = null;
let isConfigured = false;

try {
  // Try to get from config (works for both dev and prod via custom-environment-variables.json)
  redisHost = config.get('App.redis.host');
  console.log("redis",redisHost)
  redisPort = parseInt(config.get('App.redis.port'), 10);
  
  if (redisHost && !isNaN(redisPort) && redisPort > 0) {
    isConfigured = true;
  }
} catch (err) {
  // Config not available, try environment variables directly
  redisHost = process.env.REDIS_HOST;
  redisPort = parseInt(process.env.REDIS_PORT, 10);
  
  if (redisHost && !isNaN(redisPort) && redisPort > 0) {
    isConfigured = true;
  }
}

// Validate configuration
console.log('==========================================');
console.log('Redis Configuration Summary');
console.log('==========================================');
console.log(`REDIS_HOST: ${redisHost || 'NOT SET'}`);
console.log(`REDIS_PORT: ${redisPort || 'NOT SET'}`);
console.log(`REDIS_DB: ${REDIS_DB}`);
console.log(`Configuration Status: ${isConfigured ? 'VALID' : 'INVALID'}`);
console.log('==========================================');

if (!isConfigured) {
  console.error('==========================================');
  console.error('Redis Configuration Error');
  console.error('==========================================');
  console.error('Missing or invalid Redis configuration:');
  console.error(`  - REDIS_HOST: ${redisHost || 'NOT SET'}`);
  console.error(`  - REDIS_PORT: ${redisPort || 'NOT SET'}`);
  console.error('==========================================');
  console.error('Please ensure REDIS_HOST and REDIS_PORT are set in environment variables');
  console.error('or configured in config/custom-environment-variables.json');
  console.error('==========================================');
}

// ============================================
// Redis Client State
// ============================================
let redisClient = null;
let isConnecting = false;
let connectionStartTime = null;
let reconnectAttempts = 0;
let isConnected = false;
let connectionReadyPromise = null;
let connectionReadyResolve = null;
let connectionReadyReject = null;
let lastConnectionAttemptTime = null;
let lastErrorTime = null;
let lastError = null;
let totalRetryCount = 0;
let firstConnectionAttemptTime = null;

// ============================================
// Exponential Backoff Calculator
// ============================================
const calculateReconnectDelay = (retries) => {
  // Exponential backoff: 2^retries * initialDelay
  // Capped at MAX_RECONNECT_DELAY
  const delay = Math.min(
    Math.pow(2, retries) * INITIAL_RECONNECT_DELAY,
    MAX_RECONNECT_DELAY
  );
  return delay;
};

// ============================================
// Create Redis Client with Reconnection Strategy
// ============================================
const createRedisClient = () => {
  if (!isConfigured) {
    throw new Error('Redis configuration is not available');
  }

  return createClient({
    socket: {
      host: redisHost,
      port: redisPort,
      connectTimeout: CONNECT_TIMEOUT,
      reconnectStrategy: (retries) => {
        // Infinite retries with exponential backoff
        if (retries > MAX_RECONNECT_ATTEMPTS) {
          // This should never happen with Infinity, but keeping for safety
          console.error(`Redis: Max reconnection attempts exceeded. Stopping reconnection.`);
          return new Error('Max reconnection attempts exceeded');
        }

        const delay = calculateReconnectDelay(retries);
        reconnectAttempts = retries;
        totalRetryCount = retries;
        lastConnectionAttemptTime = Date.now();
        const retryTimestamp = new Date().toISOString();
        const timeSinceFirstAttempt = firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : 0;
        
        // Enhanced retry logging with exponential backoff details
        console.log('==========================================');
        console.log(`Redis: Retry Attempt #${retries}`);
        console.log('==========================================');
        console.log(`Timestamp: ${retryTimestamp}`);
        console.log(`Target: ${redisHost}:${redisPort} | Database: ${REDIS_DB}`);
        console.log(`Exponential Backoff Calculation:`);
        console.log(`  - Formula: min(2^${retries} * ${INITIAL_RECONNECT_DELAY}ms, ${MAX_RECONNECT_DELAY}ms)`);
        console.log(`  - Calculated Delay: ${delay}ms`);
        console.log(`  - Base Delay: ${INITIAL_RECONNECT_DELAY}ms`);
        console.log(`  - Max Delay Cap: ${MAX_RECONNECT_DELAY}ms`);
        if (lastErrorTime) {
          const timeSinceLastError = Date.now() - lastErrorTime;
          console.log(`  - Time Since Last Error: ${timeSinceLastError}ms`);
        }
        if (firstConnectionAttemptTime) {
          console.log(`  - Total Time Since First Attempt: ${timeSinceFirstAttempt}ms (${(timeSinceFirstAttempt / 1000).toFixed(2)}s)`);
        }
        if (lastError && lastError.code) {
          console.log(`  - Last Error Code: ${lastError.code}`);
          if (lastError.code === 'ECONNREFUSED') {
            console.log(`  - Error Category: Security Group / Connection Refused`);
          } else if (lastError.code === 'ETIMEDOUT') {
            console.log(`  - Error Category: Network Timeout`);
          } else if (lastError.code === 'ENOTFOUND') {
            console.log(`  - Error Category: DNS Resolution Failure`);
          }
        }
        console.log('==========================================');
        
        return delay;
      },
      // AWS ElastiCache specific settings
      keepAlive: 30000, // 30 seconds keep-alive
      noDelay: true, // Disable Nagle's algorithm for lower latency
    },
    database: REDIS_DB,
    // Additional AWS ElastiCache optimizations
    pingInterval: 30000, // Ping every 30 seconds to keep connection alive
  });
};

// ============================================
// Event Handlers
// ============================================
const setupEventHandlers = (client) => {
  connectionStartTime = Date.now();
  reconnectAttempts = 0;
  lastConnectionAttemptTime = Date.now();

  // Connection established (but not ready for commands)
  client.on('connect', () => {
    const connectionTime = connectionStartTime ? Date.now() - connectionStartTime : 0;
    const connectTimestamp = new Date().toISOString();
    const timeSinceFirstAttempt = firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : 0;
    
    console.log('==========================================');
    console.log('Redis: Connection Established (TCP)');
    console.log('==========================================');
    console.log(`Timestamp: ${connectTimestamp}`);
    console.log(`Host: ${redisHost}:${redisPort}`);
    console.log(`Database: ${REDIS_DB}`);
    console.log(`Connection Time (this attempt): ${connectionTime}ms (${(connectionTime / 1000).toFixed(2)}s)`);
    if (firstConnectionAttemptTime) {
      console.log(`Total Time Since First Attempt: ${timeSinceFirstAttempt}ms (${(timeSinceFirstAttempt / 1000).toFixed(2)}s)`);
    }
    console.log(`Total Retry Count: ${totalRetryCount}`);
    console.log('==========================================');
  });

  // Client ready to accept commands
  client.on('ready', async () => {
    isConnected = true;
    reconnectAttempts = 0;
    const readyTime = connectionStartTime ? Date.now() - connectionStartTime : 0;
    const readyTimestamp = new Date().toISOString();
    const timeSinceFirstAttempt = firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : 0;
    
    console.log('==========================================');
    console.log('Redis: Connection SUCCESS - Client Ready');
    console.log('==========================================');
    console.log(`Timestamp: ${readyTimestamp}`);
    console.log(`Host: ${redisHost}:${redisPort}`);
    console.log(`Database: ${REDIS_DB}`);
    console.log(`Connection Time (this attempt): ${readyTime}ms (${(readyTime / 1000).toFixed(2)}s)`);
    if (firstConnectionAttemptTime) {
      console.log(`Total Time Since First Attempt: ${timeSinceFirstAttempt}ms (${(timeSinceFirstAttempt / 1000).toFixed(2)}s)`);
    }
    console.log(`Total Retry Count: ${totalRetryCount}`);
    console.log(`Status: CONNECTED`);
    console.log('==========================================');

    // Resolve connection ready promise
    if (connectionReadyResolve) {
      connectionReadyResolve();
      connectionReadyResolve = null;
      connectionReadyReject = null;
    }

    // Verify connection with PING
    try {
      const result = await client.ping();
      console.log(`Redis: PING successful - ${result}`);
    } catch (err) {
      console.error(`Redis: PING failed - ${err.message}`);
    }
  });

  // Connection errors
  client.on('error', (err) => {
    isConnected = false;
    lastError = err;
    lastErrorTime = Date.now();
    const errorTime = connectionStartTime ? Date.now() - connectionStartTime : 0;
    const errorTimestamp = new Date().toISOString();
    const timeSinceFirstAttempt = firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : 0;
    
    console.error('==========================================');
    console.error('Redis: Connection Error');
    console.error('==========================================');
    console.error(`Timestamp: ${errorTimestamp}`);
    console.error(`Error Type: ${err.constructor.name}`);
    console.error(`Error Message: ${err.message}`);
    console.error(`Host: ${redisHost}:${redisPort}`);
    console.error(`Database: ${REDIS_DB}`);
    console.error(`Reconnect Attempts: ${reconnectAttempts}`);
    console.error(`Total Retry Count: ${totalRetryCount}`);
    if (errorTime > 0) {
      console.error(`Time Elapsed Since Connection Start: ${errorTime}ms (${(errorTime / 1000).toFixed(2)}s)`);
    }
    if (firstConnectionAttemptTime) {
      console.error(`Total Time Since First Attempt: ${timeSinceFirstAttempt}ms (${(timeSinceFirstAttempt / 1000).toFixed(2)}s)`);
    }
    
    if (err.code) {
      console.error(`Error Code: ${err.code}`);
      
      // Enhanced error messages with explicit categorization
      if (err.code === 'ECONNREFUSED') {
        console.error('==========================================');
        console.error('Error Category: SECURITY GROUP / CONNECTION REFUSED');
        console.error('==========================================');
        console.error('Possible causes:');
        console.error('  1. Redis server is not running');
        console.error('  2. Security group is blocking the connection');
        console.error('  3. Redis is bound to localhost only');
        console.error('  4. Port is incorrect or firewall is blocking');
        console.error(`  5. Check AWS ElastiCache security group rules for ${redisHost}:${redisPort}`);
        console.error('==========================================');
      } else if (err.code === 'ETIMEDOUT') {
        console.error('==========================================');
        console.error('Error Category: NETWORK TIMEOUT');
        console.error('==========================================');
        console.error('Possible causes:');
        console.error('  1. Network connectivity issues');
        console.error('  2. Security group rules are too restrictive');
        console.error('  3. Redis server is overloaded or unresponsive');
        console.error('  4. Network latency is too high');
        console.error(`  5. Verify network path to ${redisHost}:${redisPort}`);
        console.error('==========================================');
      } else if (err.code === 'ENOTFOUND') {
        console.error('==========================================');
        console.error('Error Category: DNS RESOLUTION FAILURE');
        console.error('==========================================');
        console.error('Possible causes:');
        console.error('  1. DNS resolution failure');
        console.error('  2. Incorrect hostname or endpoint');
        console.error('  3. Network configuration issue');
        console.error(`  4. Verify hostname "${redisHost}" is correct and resolvable`);
        console.error('==========================================');
      }
    }
    if (err.syscall) {
      console.error(`System Call: ${err.syscall}`);
    }
    if (err.address) {
      console.error(`Address: ${err.address}`);
    }
    if (err.port) {
      console.error(`Port: ${err.port}`);
    }
    console.error('==========================================');
  });

  // Reconnecting event
  client.on('reconnecting', () => {
    console.log(`Redis: Reconnecting to ${redisHost}:${redisPort}...`);
    console.log(`Attempt: ${reconnectAttempts + 1} | Database: ${REDIS_DB}`);
  });

  // Connection ended
  client.on('end', () => {
    isConnected = false;
    console.log(`Redis: Connection ended for ${redisHost}:${redisPort}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
  });

  // Connection closed
  client.on('close', () => {
    isConnected = false;
    console.log(`Redis: Connection closed for ${redisHost}:${redisPort}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
  });
};

// ============================================
// Connect to Redis
// ============================================
const connectRedis = async () => {
  if (!isConfigured) {
    console.error('Redis: Cannot connect - configuration is missing');
    if (connectionReadyReject) {
      connectionReadyReject(new Error('Redis configuration is missing'));
      connectionReadyResolve = null;
      connectionReadyReject = null;
    }
    return;
  }

  if (isConnecting) {
    console.log('Redis: Connection already in progress, skipping...');
    return;
  }

  if (redisClient && isConnected) {
    console.log('Redis: Already connected, skipping...');
    if (connectionReadyResolve) {
      connectionReadyResolve();
      connectionReadyResolve = null;
      connectionReadyReject = null;
    }
    return;
  }

  isConnecting = true;
  connectionStartTime = Date.now();
  if (!firstConnectionAttemptTime) {
    firstConnectionAttemptTime = Date.now();
  }
  lastConnectionAttemptTime = Date.now();
  totalRetryCount = 0;

  // Create connection ready promise if it doesn't exist
  if (!connectionReadyPromise) {
    connectionReadyPromise = new Promise((resolve, reject) => {
      connectionReadyResolve = resolve;
      connectionReadyReject = reject;
    });
  }

  console.log('==========================================');
  console.log('Redis: Initiating Connection');
  console.log('==========================================');
  console.log(`Host: ${redisHost}`);
  console.log(`Port: ${redisPort}`);
  console.log(`Database: ${REDIS_DB}`);
  console.log(`Connect Timeout: ${CONNECT_TIMEOUT}ms`);
  console.log(`Max Initial Wait Time: ${MAX_INITIAL_CONNECT_WAIT_TIME}ms`);
  console.log(`Reconnect Strategy: Exponential backoff (max ${MAX_RECONNECT_DELAY}ms)`);
  console.log(`Start Time: ${new Date().toISOString()}`);
  console.log('==========================================');

  try {
    // Create client
    redisClient = createRedisClient();
    setupEventHandlers(redisClient);

    // Attempt connection
    await redisClient.connect();

    // Connection successful
    const totalTime = connectionStartTime ? Date.now() - connectionStartTime : 0;
    const successTimestamp = new Date().toISOString();
    const timeSinceFirstAttempt = firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : 0;
    
    console.log('==========================================');
    console.log('Redis: Connection SUCCESS');
    console.log('==========================================');
    console.log(`Success Timestamp: ${successTimestamp}`);
    console.log(`Host: ${redisHost}:${redisPort}`);
    console.log(`Database: ${REDIS_DB}`);
    console.log(`Connection Time (this attempt): ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
    if (firstConnectionAttemptTime) {
      console.log(`Total Time Since First Attempt: ${timeSinceFirstAttempt}ms (${(timeSinceFirstAttempt / 1000).toFixed(2)}s)`);
    }
    console.log(`Total Retry Count: ${totalRetryCount}`);
    console.log(`Status: CONNECTED`);
    console.log('Auto-reconnect enabled with exponential backoff');
    console.log('==========================================');

    isConnecting = false;
    isConnected = true;

  } catch (err) {
    isConnecting = false;
    isConnected = false;
    lastError = err;
    lastErrorTime = Date.now();
    const totalTime = Date.now() - connectionStartTime;

    const failureTimestamp = new Date().toISOString();
    const timeSinceFirstAttempt = firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : 0;
    
    console.error('==========================================');
    console.error('Redis: Connection FAILURE');
    console.error('==========================================');
    console.error(`Failure Timestamp: ${failureTimestamp}`);
    console.error(`Error Type: ${err.constructor.name}`);
    console.error(`Error Message: ${err.message}`);
    console.error(`Host: ${redisHost}:${redisPort}`);
    console.error(`Database: ${REDIS_DB}`);
    console.error(`Attempt Duration: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
    if (firstConnectionAttemptTime) {
      console.error(`Total Time Since First Attempt: ${timeSinceFirstAttempt}ms (${(timeSinceFirstAttempt / 1000).toFixed(2)}s)`);
    }
    console.error(`Total Retry Count: ${totalRetryCount}`);
    console.error(`Status: FAILED - Will retry with exponential backoff`);

    if (err.code) {
      console.error(`Error Code: ${err.code}`);
      
      // Enhanced error messages with explicit categorization
      if (err.code === 'ECONNREFUSED') {
        console.error('==========================================');
        console.error('Error Category: SECURITY GROUP / CONNECTION REFUSED');
        console.error('==========================================');
        console.error('Possible causes:');
        console.error('  1. Redis server is not running');
        console.error('  2. Security group is blocking the connection');
        console.error('  3. Redis is bound to localhost only');
        console.error('  4. Port is incorrect or firewall is blocking');
        console.error(`  5. Check AWS ElastiCache security group rules for ${redisHost}:${redisPort}`);
        console.error('==========================================');
      } else if (err.code === 'ETIMEDOUT') {
        console.error('==========================================');
        console.error('Error Category: NETWORK TIMEOUT');
        console.error('==========================================');
        console.error('Possible causes:');
        console.error('  1. Network connectivity issues');
        console.error('  2. Security group rules are too restrictive');
        console.error('  3. Redis server is overloaded or unresponsive');
        console.error('  4. Network latency is too high');
        console.error(`  5. Verify network path to ${redisHost}:${redisPort}`);
        console.error('==========================================');
      } else if (err.code === 'ENOTFOUND') {
        console.error('==========================================');
        console.error('Error Category: DNS RESOLUTION FAILURE');
        console.error('==========================================');
        console.error('Possible causes:');
        console.error('  1. DNS resolution failure');
        console.error('  2. Incorrect hostname or endpoint');
        console.error('  3. Network configuration issue');
        console.error(`  4. Verify hostname "${redisHost}" is correct and resolvable`);
        console.error('==========================================');
      }
    }
    if (err.syscall) {
      console.error(`System Call: ${err.syscall}`);
    }
    if (err.address) {
      console.error(`Address: ${err.address}`);
    }
    if (err.port) {
      console.error(`Port: ${err.port}`);
    }

    console.error('==========================================');
    console.error('Troubleshooting Steps:');
    console.error('   1. Verify REDIS_HOST and REDIS_PORT environment variables are set');
    console.error('   2. Check AWS ElastiCache cluster is running and accessible');
    console.error('   3. Verify security group allows connections from ECS tasks');
    console.error('   4. Check network connectivity to Redis endpoint');
    console.error('   5. Verify Redis database number is correct');
    console.error('==========================================');

    // Clean up failed client (but keep reference for reconnection)
    if (redisClient) {
      try {
        redisClient.removeAllListeners();
        await redisClient.quit().catch(() => {});
        redisClient.disconnect().catch(() => {});
      } catch (e) {
        // Ignore cleanup errors
      }
      // Keep redisClient reference for reconnection - don't set to null
    }

    // Reject connectionReadyPromise if we've exceeded the maximum wait time
    // This prevents services from hanging indefinitely if initial connection fails
    if (connectionReadyReject && firstConnectionAttemptTime) {
      const timeSinceFirstAttempt = Date.now() - firstConnectionAttemptTime;
      if (timeSinceFirstAttempt >= MAX_INITIAL_CONNECT_WAIT_TIME) {
        console.error(`Redis: Rejecting connection promise after ${timeSinceFirstAttempt}ms (exceeded max wait time of ${MAX_INITIAL_CONNECT_WAIT_TIME}ms)`);
        connectionReadyReject(err);
        connectionReadyResolve = null;
        connectionReadyReject = null;
        connectionReadyPromise = null;
      }
    } else if (connectionReadyReject) {
      // Reject immediately if this is the first connection attempt and it fails
      // This prevents services from waiting unnecessarily when connection fails immediately
      // Note: reconnectStrategy will still handle automatic reconnection in the background
      console.error(`Redis: Rejecting connection promise immediately on first connection failure`);
      connectionReadyReject(err);
      connectionReadyResolve = null;
      connectionReadyReject = null;
      connectionReadyPromise = null;
    }

    // The reconnectStrategy will handle automatic reconnection
    // We don't throw here to allow the app to continue
    console.log('Redis: Will attempt automatic reconnection via reconnectStrategy...');
  }
};

// ============================================
// Graceful Shutdown
// ============================================
const disconnectRedis = async () => {
  if (!redisClient) {
    return;
  }

  console.log('==========================================');
  console.log('Redis: Initiating Graceful Disconnect');
  console.log('==========================================');
  console.log(`Host: ${redisHost}:${redisPort}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('==========================================');

  try {
    await redisClient.quit();
    console.log('Redis: Gracefully disconnected');
  } catch (err) {
    console.error(`Redis: Error during disconnect - ${err.message}`);
    try {
      redisClient.disconnect();
    } catch (e) {
      // Ignore
    }
  } finally {
    redisClient = null;
    isConnected = false;
    isConnecting = false;
  }
};

// ============================================
// Connection Status
// ============================================
const getConnectionStatus = () => {
  return {
    connected: isConnected,
    connecting: isConnecting,
    configured: isConfigured,
    host: redisHost,
    port: redisPort,
    database: REDIS_DB,
    reconnectAttempts: reconnectAttempts,
    totalRetryCount: totalRetryCount,
    connectionStartTime: connectionStartTime ? new Date(connectionStartTime).toISOString() : null,
    lastConnectionAttemptTime: lastConnectionAttemptTime ? new Date(lastConnectionAttemptTime).toISOString() : null,
    lastErrorTime: lastErrorTime ? new Date(lastErrorTime).toISOString() : null,
    lastError: lastError ? {
      code: lastError.code,
      message: lastError.message,
      syscall: lastError.syscall
    } : null,
    firstConnectionAttemptTime: firstConnectionAttemptTime ? new Date(firstConnectionAttemptTime).toISOString() : null,
    timeSinceFirstAttempt: firstConnectionAttemptTime ? Date.now() - firstConnectionAttemptTime : null
  };
};

// ============================================
// Wait for Connection
// ============================================
const waitForConnection = async (timeout = MAX_INITIAL_CONNECT_WAIT_TIME) => {
  if (isConnected && redisClient) {
    return;
  }

  if (!isConfigured) {
    throw new Error('Redis configuration is missing');
  }

  // If connection is already in progress, wait for existing promise
  if (connectionReadyPromise) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Redis connection wait timeout after ${timeout}ms`));
      }, timeout);
    });

    return Promise.race([connectionReadyPromise, timeoutPromise]);
  }

  // If not connecting, start connection
  if (!isConnecting) {
    connectRedis();
  }

  // Create new promise if needed
  if (!connectionReadyPromise) {
    connectionReadyPromise = new Promise((resolve, reject) => {
      connectionReadyResolve = resolve;
      connectionReadyReject = reject;
    });
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Redis connection wait timeout after ${timeout}ms. Current status: ${JSON.stringify(getConnectionStatus())}`));
    }, timeout);
  });

  return Promise.race([connectionReadyPromise, timeoutPromise]);
};

// ============================================
// Health Check
// ============================================
const healthCheck = async () => {
  if (!redisClient || !isConnected) {
    return { status: 'disconnected', connected: false };
  }

  try {
    const result = await redisClient.ping();
    return { 
      status: 'healthy', 
      connected: true, 
      ping: result,
      host: redisHost,
      port: redisPort,
      database: REDIS_DB
    };
  } catch (err) {
    return { 
      status: 'unhealthy', 
      connected: false, 
      error: err
    };
  }
};

// ============================================
// Initialize Connection
// ============================================
// Connect immediately on module load
if (isConfigured) {
  connectRedis();
} else {
  console.error('Redis: Skipping connection - configuration missing');
}

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('SIGTERM received - disconnecting Redis...');
  await disconnectRedis();
});

process.on('SIGINT', async () => {
  console.log('SIGINT received - disconnecting Redis...');
  await disconnectRedis();
  process.exit(0);
});

// ============================================
// Connection Ready Promise/Function
// ============================================
// Export a function that returns a promise resolving when Redis is ready
const getConnectionPromise = () => {
  // 1. Already connected - return immediately
  if (isConnected && redisClient) {
    return Promise.resolve();
  }

  // 2. Not configured - reject immediately
  if (!isConfigured) {
    return Promise.reject(new Error('Redis configuration is missing'));
  }

  // 3. Promise already exists - return it (atomic check)
  if (connectionReadyPromise) {
    return connectionReadyPromise;
  }

  // 4. Start connection if needed
  if (!isConnecting) {
    connectRedis(); // This may create connectionReadyPromise
  }

  // 5. Check again after connectRedis() - it may have created the promise
  // This prevents race condition where connectRedis() creates promise but
  // we overwrite it with a new one
  if (connectionReadyPromise) {
    return connectionReadyPromise;
  }

  // 6. Only create if still doesn't exist (defensive check)
  // This handles edge cases where connectRedis() returns early but promise exists
  if (!connectionReadyPromise) {
    connectionReadyPromise = new Promise((resolve, reject) => {
      connectionReadyResolve = resolve;
      connectionReadyReject = reject;
    });
  }

  return connectionReadyPromise;
};

// ============================================
// Export
// ============================================
// Export a Proxy that forwards to the current redisClient
// This ensures services always get the latest client instance
export default new Proxy({}, {
  get(target, prop) {
    // Special properties
    if (prop === 'isConnected') {
      return isConnected;
    }
    if (prop === 'healthCheck') {
      return healthCheck;
    }
    if (prop === 'disconnect') {
      return disconnectRedis;
    }
    if (prop === 'reconnect') {
      return connectRedis;
    }
    if (prop === 'waitForConnection') {
      return waitForConnection;
    }
    if (prop === 'getConnectionStatus') {
      return getConnectionStatus;
    }
    if (prop === 'getConnectionPromise') {
      return getConnectionPromise;
    }
    if (prop === 'connectionPromise') {
      return getConnectionPromise();
    }

    // Forward to redisClient
    if (!redisClient) {
      throw new Error('Redis client is not initialized. Please check REDIS_HOST and REDIS_PORT environment variables.');
    }

    const value = redisClient[prop];
    
    // If it's a function, bind it to redisClient to maintain 'this' context
    if (typeof value === 'function') {
      return value.bind(redisClient);
    }
    
    return value;
  },
  has(target, prop) {
    return redisClient && prop in redisClient;
  },
  ownKeys(target) {
    return redisClient ? Object.keys(redisClient) : [];
  },
  getOwnPropertyDescriptor(target, prop) {
    if (redisClient && prop in redisClient) {
      return Object.getOwnPropertyDescriptor(redisClient, prop);
    }
    return undefined;
  }
});

// Export connection promise function
export { getConnectionPromise, waitForConnection, getConnectionStatus, healthCheck };