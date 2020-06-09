import path from 'path';

import {Sequelize} from 'sequelize-typescript';

async function initDataBase({force = false}: { force: boolean }) {
    const connectionString = process.env.DB_CONN;

    if (connectionString) {
        const sequelize = new Sequelize(
            connectionString,
            {
                modelPaths: [path.join(__dirname, 'models')]
            }
        );
        await sequelize.sync({force});
    } else {
        throw new Error('DataBase connection string is not defined');
    }
}

export default initDataBase;
