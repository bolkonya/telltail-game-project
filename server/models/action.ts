import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';

import Scene from './scene';

@Table({
    tableName: 'actions'
})
class Action extends Model<Action> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @ForeignKey(() => Scene)
    @Column(DataType.INTEGER)
    ownerSceneId: number;

    @BelongsTo(() => Scene, 'ownerSceneId')
    ownerScene: Scene;

    @ForeignKey(() => Scene)
    @Column(DataType.INTEGER)
    targetSceneId: number;

    @BelongsTo(() => Scene, 'targetSceneId')
    targetScene: Scene;
}

export default Action;
