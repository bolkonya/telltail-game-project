import {Request, Response} from 'express';
import Tag from '../models/tag';

export async function tagList(_req: Request, res: Response) {
    const tags = await Tag.findTags();
    res.json(tags);
}
