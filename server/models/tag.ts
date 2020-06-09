import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';

import Adventure from './adventure';
import TagAdventure from './tagAdventure';

@Table({
    tableName: 'tags'
})
class Tag extends Model<Tag> {
    static async getTagObjByName(tagName: string) {
        const tag = await Tag.findOne({
            where: {name: tagName},
            include: [
                {
                    model: Adventure,
                    include: [{all: true}]
                }
            ]
        });

        return tag;
    }

    static async findTags() {
        const tags = await Tag.findAll();
        return tags;
    }

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    slug: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @BelongsToMany(() => Adventure, () => TagAdventure)
    adventures: Adventure[];
}

export default Tag;
