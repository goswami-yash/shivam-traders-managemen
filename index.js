import app, {
    initializeRedis,
    getRedisStore
} from './server/server.js';

import config from 'config';
import debugLib from 'debug';

const debug = debugLib("gseb-ht-gen-backend:index");

const PORT = config.get('App.config.port') || 3000;

async function startServer() {
    try {
        console.log('==========================================');
        console.log('Initializing Redis...');
        console.log('==========================================');

        await initializeRedis();

        console.log('Redis initialized successfully');

        console.log('==========================================');
        console.log('Pre-initializing RedisStore...');
        console.log('==========================================');

        await getRedisStore();

        console.log('RedisStore initialized successfully');

        app.listen(PORT, () => {
            debug(`server started on port ${PORT} (${process.env.NODE_ENV})`);
            console.log(
                `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
            );
        });

    } catch (err) {
        console.error('==========================================');
        console.error('❌ SERVER STARTUP FAILED');
        console.error('==========================================');
        console.error(err);
        process.exit(1);
    }
}

startServer();

export default app;