import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';

import Sequelize from 'sequelize';

import Scene from './scene';
import Tag from './tag';
import TagAdventure from './tagAdventure';
import {IFilterOptions} from '../../common/types';

const Op = Sequelize.Op;
const LANGUAGE = 'russian';
const FIELDS_TO_SEARCH = ['name', 'description'];

const makeSearchVectorString = (language: string, fields: string[], keyword: string) =>
    fields.map((field) =>
        Sequelize.literal(
            `to_tsvector('${language}', ${field}) @@ plainto_tsquery('${language}', '${keyword}')`
        )
    );

@Table({
    tableName: 'adventures'
})
class Adventure extends Model<Adventure> {
    static async findAdventures(limit: number, offset: number) {
        const adventures = await Adventure.findAll({
            limit,
            offset,
            where: {
                firstSceneId: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: Tag
                }
            ]});

        return adventures;
    }

    static async findFilteredAdventures(filtersOptions: IFilterOptions) {
        const {count, offset, tags, keyword} = filtersOptions;

        const where = {
            [Op.and]: {
                firstSceneId: {
                    [Op.not]: null
                },
                ...keyword && {[Op.or]: makeSearchVectorString(LANGUAGE, FIELDS_TO_SEARCH, keyword)},
                ...tags.length && {id: {[Op.or]: await TagAdventure.getAdventuresIdByTags(tags)}}
            }
        };

        const adventures = await Adventure.findAll({
            limit: count,
            offset,
            where,
            include: [
                {
                    model: Tag
                }
            ]
        });

        return adventures;
    }

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    description: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    image: string;

    @ForeignKey(() => Scene)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    firstSceneId: number;

    @HasMany(() => Scene)
    scenes: Scene[];

    @BelongsTo(() => Scene, {foreignKey: 'firstSceneId', constraints: false})
    firstScene: Scene;

    @BelongsToMany(() => Tag, () => TagAdventure)
    tags: Tag[];

    async addTags(tags: Tag[]) {
        for (const tag of tags) {
            TagAdventure.findOrCreate({
                where: {
                    adventureId: this.id,
                    tagId: tag.id
                },
                defaults: {
                    adventureId: this.id,
                    tagId: tag.id
                }
            });
        }
    }

    async addScene({description, image, position}: { description?: string, image?: string, position?: string}) {
        const scene = await Scene.create({
            description,
            image,
            position,
            adventureId: this.id
        });

        if (!this.firstSceneId) {
            this.setFirstScene(scene);
        }

        return scene;
    }

    async setFirstScene(scene: Scene) {
        this.firstSceneId = scene.id;
        await this.save();
    }
}

export default Adventure;
