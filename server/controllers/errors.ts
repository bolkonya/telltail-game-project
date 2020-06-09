import {Request, Response} from 'express';

function makeErrorHandler(errCode: number) {
    return (_req: Request, res: Response) => res.sendStatus(errCode);
}

export const error404 = makeErrorHandler(404);
export const error500 = makeErrorHandler(500);
