import {parse} from 'url';

import {Application} from 'express';

import {adventuresList, listByTag} from './controllers/adventures';
import {sceneById} from './controllers/scenes';
import {tagList} from './controllers/tags';
import {registerUser} from './controllers/users';

import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage }); //multer({ dest: './uploads/' });

export = (app: Application) => {
    app.get('/', (_req, res) => res.renderPage('/index'));
    app.get('/adventures', (_req, res) => res.renderPage('/index'));
    app.get('/tag/:tagname', (_req, res) => res.renderPage('/tag')); // , { tagName: req.params.tagname }
    app.get('/adventures/:adventureid([0-9]+)/scenes/:sceneid([0-9]+)', (_req, res) => res.renderPage('/scene'));
    app.get('/registration', (_req, res) => res.renderPage('/registration'));

    app.post('/api/registration', upload.single('avatar'), registerUser); //upload.single('avatar'),

    app.get('/api/adventures', adventuresList);
    app.get('/api/tags', tagList);
    app.get('/api/tag/:tagname/adventures', listByTag);
    app.get('/api/adventures/:adventureid([0-9]+)/scenes/:sceneid([0-9]+)', sceneById);

    app.all('*', (req, res) => {
        const handleRequest = req.nextApp.getRequestHandler();
        const parsedUrl = parse(req.url, true);

        return handleRequest(req, res, parsedUrl);
    });
};
