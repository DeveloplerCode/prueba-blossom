import { Sequelize } from 'sequelize';



import { config } from '../config/config';

const conexion = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT as any,
    // logging: false,
});

export default conexion;
