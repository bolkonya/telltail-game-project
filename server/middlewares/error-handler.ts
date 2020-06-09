import {error500} from '../controllers/errors';
import {NextFunction as Next, Request, Response} from 'express';

export default (err: Error, req: Request, res: Response, _next: Next) => {
    console.error(err.stack);

    error500(req, res);
};
