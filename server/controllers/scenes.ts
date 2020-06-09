import {Request, Response} from 'express';

import Scene from '../models/scene';
import {error404} from './errors';

export async function sceneById(req: Request, res: Response) {
    const sceneId = req.params.sceneid;
    const adventureId = Number(req.params.adventureid);
    const scene = await Scene.findById(Number(sceneId));

    if (scene && scene.adventureId === adventureId) {
        res.json(scene);
    } else {
        error404(req, res);
    }
}
