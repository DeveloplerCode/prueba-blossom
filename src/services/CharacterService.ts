// src/services/CharacterService.ts

import redisClient from '../databases/redis';
import Character from '../models/Character';
import { Op } from 'sequelize';
import axios from 'axios';
import { config } from '../config/config';
import { ICharacterFilters } from '../commons/interfaces/Iservices';

const CACHE_EXPIRATION = 3600;
const RICK_MORTY_GRAPHQL_ENDPOINT = config.RICK_MORTY_GRAPHQL_ENDPOINT;

class CharacterService {

    /**
     * Busca primero en Redis, luego en DB
     */
    public async searchLocalCharacters(args: ICharacterFilters) {

        const cacheKey = JSON.stringify(args);

        try {
            // Buscar en Redis
            const cachedResult = await redisClient.get(cacheKey);
            if (cachedResult) {
                console.log('✅ Redis: datos encontrados.');
                return JSON.parse(cachedResult);
            }

            // Construir query para DB
            const where: any = {};
            if (args.status) where.status = args.status;
            if (args.species) where.species = args.species;
            if (args.gender) where.gender = args.gender;
            if (args.name) where.name = { [Op.iLike]: `%${args.name}%` };
            if (args.origin) where.origin = { [Op.iLike]: `%${args.origin}%` };

            // Buscar en DB
            const characters = await Character.findAll({ where });

            // Si encuentra en DB, guardamos en Redis
            if (characters.length > 0) {
                await redisClient.setEx(cacheKey, CACHE_EXPIRATION, JSON.stringify(characters));
                console.log("💾 Guardado en Redis desde DB.");
            }

            return characters;

        } catch (error) {
            console.error("❌ Error searchLocalCharacters:", error);
            throw new Error("No se pudo buscar localmente.");
        }
    }

    /**
     * Llama a la API externa (GraphQL)
     */
    public async searchExternalAPI(filters: ICharacterFilters) {
        const graphqlQuery = {
            query: `
                query getCharacters($filter: FilterCharacter) {
                    characters(filter: $filter) {
                        info { count }
                        results { id name status species gender origin { name } image }
                    }
                }
            `,
            variables: { filter: filters }
        };

        try {
            const { data } = await axios.post(RICK_MORTY_GRAPHQL_ENDPOINT, graphqlQuery);

            if (data.data.characters) {
                return data.data.characters;
            }

            throw { status: 404, msg: "No se encontraron personajes en la API." };

        } catch (error: any) {
            console.error("❌ Error en API externa:", error);
            throw error;
        }
    }

    /**
     * Guarda los personajes traídos de la API en la DB y los retorna
     */
    public async saveExternalCharacters(characters: any[]) {

        const saved = [];

        for (const char of characters) {
            const exists = await Character.findOne({ where: { id: char.id } });

            if (!exists) {
                const newChar = await Character.create({
                    id: char.id,
                    name: char.name,
                    status: char.status,
                    species: char.species,
                    gender: char.gender,
                    origin: char.origin?.name || "Unknown"
                });

                saved.push(newChar);
            } else {
                saved.push(exists);
            }
        }

        return saved;
    }
}

export const characterService = new CharacterService();
