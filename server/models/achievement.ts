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

import AchievementScene from './achievementScene';
import Scene from './scene';

@Table({
    tableName: 'achievenents'
})
class Achievement extends Model<Achievement> {
    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    image: string;

    @BelongsToMany(() => Scene, () => AchievementScene)
    scenes: Scene[];
}

export default Achievement;
