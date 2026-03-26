import app from './server/server.js';
import config from 'config';
import debugLib from "debug";

const debug = debugLib("gseb-ht-gen-backend:index");

const PORT = config.get('App.config.port') || 3000;

app.listen(PORT, () => {
    
    debug(`server started on port ${PORT} (${process.env.NODE_ENV})`);
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;
