import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    HasOne
} from 'sequelize-typescript';

import Sequelize from 'sequelize';

import Adventure from './adventure';
import Tag from './tag';

const Op = Sequelize.Op;

@Table({
    tableName: 'tag_adventure'
})
class TagAdventure extends Model<TagAdventure> {
    static async getAdventuresIdByTags(tags: string[]) {
        const associations = await TagAdventure.findAll({
            include: [
                {
                    model: Tag,
                    where: {
                        slug: {
                            [Op.in]: tags
                        }
                    }
                }
            ]
        });

        const adventuresIdSet = new Set();
        associations.forEach(({adventureId}) => adventuresIdSet.add(adventureId));

        return Array.from(adventuresIdSet);
    }

    @ForeignKey(() => Tag)
    @Column(DataType.INTEGER)
    tagId: number;

    @HasOne(() => Tag, 'id')
    tag: Tag;

    @ForeignKey(() => Adventure)
    @Column(DataType.INTEGER)
    adventureId: number;
}

export default TagAdventure;
