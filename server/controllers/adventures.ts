import {Request, Response} from 'express';

import {error404} from './errors';
import Adventure from '../models/adventure';
import Tag from '../models/tag';
import {IFilterOptions} from '../../common/types';

export async function adventuresList(req: Request, res: Response) {
    const {count, offset, tags, keyword} = req.query;
    const filterOptions: IFilterOptions = {
        count,
        offset,
        tags: tags ? tags.split(',') : [],
        keyword
    };

    const adventures = tags || keyword ?
        await Adventure.findFilteredAdventures(filterOptions) :
        await Adventure.findAdventures(count, offset);

    res.json(adventures);
}

export async function listByTag(req: Request, res: Response) {
    const tagName = req.params.tagname;
    const tag = await Tag.getTagObjByName(tagName);
    if (tag) {
        res.json(tag);
    } else {
        error404(req, res);
    }
}
