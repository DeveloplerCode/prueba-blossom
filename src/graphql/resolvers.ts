// src/graphql/resolvers.ts

import redisClient from '../databases/redis';
import Character from '../models/Character';
import { Op } from 'sequelize';

const CACHE_EXPIRATION = 3600; // 1 hora en segundos



// Aquí implementamos la lógica de búsqueda con Sequelize y el manejo de caché con Redis. 
const rootResolver = {
    searchCharacters: async (args: any) => {
        
        // 1. Crear una clave única de caché basada en los argumentos de la consulta
        const cacheKey = JSON.stringify(args);

        try {
            // 2. Intentar obtener el resultado de Redis
            const cachedResult = await redisClient.get(cacheKey);

            if (cachedResult) {
                console.log('✅ Retornando resultados desde caché de Redis.');
                return JSON.parse(cachedResult);
            }

            // 3. Construir las condiciones de búsqueda para Sequelize (WHERE)
            const whereConditions: any = {};
            
            if (args.status) whereConditions.status = args.status;
            if (args.species) whereConditions.species = args.species;
            if (args.gender) whereConditions.gender = args.gender;
            
            // Búsqueda por nombre (usando LIKE para coincidencia parcial)
            if (args.name) whereConditions.name = { [Op.iLike]: `%${args.name}%` }; 
            
            // Búsqueda por origen
            if (args.origin) whereConditions.origin = { [Op.iLike]: `%${args.origin}%` };

            // 4. Ejecutar la consulta en la DB
            const characters = await Character.findAll({
                where: whereConditions,
            });

            // 5. Almacenar el resultado en Redis antes de retornar
            const resultJSON = JSON.stringify(characters);
            await redisClient.setEx(cacheKey, CACHE_EXPIRATION, resultJSON);

            console.log('💾 Consulta guardada en caché de Redis.');
            return characters;

        } catch (error) {
            console.error('Error al ejecutar la consulta GraphQL:', error);
            throw new Error('No se pudo completar la búsqueda de personajes.');
        }
    },
};

export default rootResolver;