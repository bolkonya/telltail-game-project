import { Request, Response } from 'express';

export async function registerUser(req: Request, res: Response) {
    console.log(req.body);
    console.log(req.file);
    res.sendStatus(200);
}
