// src/models/Character.ts

import { DataTypes, Model } from 'sequelize';
import conexion from '../databases/connection';

export interface CharacterAttributes {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    origin: string; // Simplificamos a solo el nombre del planeta de origen
}

class Character extends Model<CharacterAttributes> implements CharacterAttributes {
    public id!: number;
    public name!: string;
    public status!: string;
    public species!: string;
    public gender!: string;
    public origin!: string;
}

Character.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        species: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: conexion,
        tableName: 'Characters',
        timestamps: true,
    }
);

export default Character;