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

import Achievement from './achievement';
import AchievementScene from './achievementScene';
import Action from './action';
import Adventure from './adventure';

@Table({
    tableName: 'scenes'
})
class Scene extends Model<Scene> {
    static async findById(id: number) {
        const scene = await Scene.findByPk(id, {include: [{all: true}]});
        return scene;
    }

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(true)
    @Column(DataType.TEXT)
    description: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    image: string;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    position: string;

    @HasMany(() => Action, 'ownerSceneId')
    actions: Action[];

    @HasMany(() => Action, 'targetSceneId')
    produceActions: Action[];

    @ForeignKey(() => Adventure)
    @Column(DataType.INTEGER)
    adventureId: number;

    @BelongsTo(() => Adventure)
    adventure: Adventure;

    @BelongsToMany(() => Achievement, () => AchievementScene)
    achievements: Achievement[];

    async addAction({name, target}: {name: string, target: Scene}) {
        if (this === target) {
            console.info(`WARNING The action "${name}" is not saved because his target is the same scene!`);
        } else {
            const action = new Action({
                name,
                targetSceneId: target.id,
                ownerSceneId: this.id
            });
            await action.save();
        }
    }

    async addAchievements(achievements: Achievement[]) {
        for (const ach of achievements) {
            AchievementScene.create({achievementId: ach.id, sceneId: this.id});
        }
    }
}

export default Scene;
