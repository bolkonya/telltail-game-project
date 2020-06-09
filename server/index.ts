import path from 'path';

import config from 'config';
import express, {NextFunction as Next, Request, Response} from 'express';
import nextjs from 'next';
import bodyParser from 'body-parser';

import 'isomorphic-fetch';

import {error500} from './controllers/errors';
import initDataBase from './db-init';
import render from './middlewares/render';
import errorHandler from './middlewares/error-handler';
import routes from './routes';

function runAppListener() {
    app.listen(port, () => {
        console.info(`Server started on ${port}`);
        console.info(`Open http://localhost:${port}/`);
    });
}

const app = express();
const port = config.get('port');
const nextApp = nextjs({dev: process.env.NODE_ENV !== 'production'});

initDataBase({force: false})
    .then(() => {
        const publicDir = path.join(__dirname, 'public');

        app.use(express.static(publicDir));
        
        //app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

        //app.use(bodyParser.json({ limit: '50mb' }));

        app.use((err: Error, _req: Request, _res: Response, next: Next) => {
            console.error(err.stack);

            next();
        });

        app.use(render(nextApp));

        routes(app);

        app.use(errorHandler);

        nextApp.prepare().then(runAppListener);
    })
    .catch((e) => {
        console.error(e);
        app.all('*', error500);

        runAppListener();
    });
