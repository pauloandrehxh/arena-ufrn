import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

export function temBuildDoFrontend(publicDir) {
    return fs.existsSync(path.join(publicDir, 'index.html'));
}

export function createStaticApp(apiApp, publicDir) {
    const app = express();

    app.use(express.static(publicDir));

    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api') || req.path === '/health') {
            return next();
        }

        return res.sendFile(path.join(publicDir, 'index.html'));
    });

    app.use(apiApp);

    return app;
}
