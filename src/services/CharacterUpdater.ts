// src/services/CharacterUpdater.ts

import Character, { CharacterAttributes } from '../models/Character';
import axios from 'axios';
import { print } from 'graphql'; // Útil para convertir la consulta GraphQL a string


import { config } from '../config/config';

// Endpoint GraphQL de Rick and Morty
const RICK_MORTY_GRAPHQL_ENDPOINT = config.RICK_MORTY_GRAPHQL_ENDPOINT;

/**
 * Consulta GraphQL para obtener personajes por ID.
 * Nota: La API externa de Rick and Morty no tiene un filtro directo por [ID], 
 * por lo que usaremos el filtro `filter: { id: ID_LIST_STRING }` 
 * y limitaremos la consulta a los campos que necesitamos.
 */
function buildGraphQLQuery(ids: number[]) {
    // Convertimos los IDs a una cadena de texto separada por comas para el filtro
    const idListString = ids.join(',');

    // La consulta usa un filtro de cadena que busca IDs en la lista.
    const query = `
        query GetCharactersByIds {
          characters(filter: { id: "${idListString}" }) {
            results {
              id
              name
              status
              species
              gender
              origin {
                name
              }
            }
          }
        }
    `;
    return query;
}

/**
 * Función para obtener los datos más recientes de la API externa
 * usando GraphQL.
 * @param ids Array de IDs de personajes locales.
 */
async function fetchLatestDataGraphQL(ids: number[]): Promise<CharacterAttributes[]> {
    if (ids.length === 0) return [];
    
    const graphqlQuery = buildGraphQLQuery(ids);

    try {
        const response = await axios.post(RICK_MORTY_GRAPHQL_ENDPOINT, {
            query: graphqlQuery,
        });

        // Manejo de errores de GraphQL
        if (response.data.errors) {
            console.error('Error de GraphQL:', response.data.errors);
            throw new Error('Fallo en la consulta GraphQL a la API externa.');
        }

        // Accedemos a los resultados
        const remoteCharactersData = response.data.data.characters.results;

        // Mapear los datos de la API al formato de nuestro modelo local
        return remoteCharactersData.map((char: any) => ({
            id: char.id,
            name: char.name,
            status: char.status,
            species: char.species,
            gender: char.gender,
            origin: char.origin.name, // Extraemos solo el nombre del origen
        }));

    } catch (error) {
        console.error('Error al conectar o consultar la API GraphQL:', error);
        return []; // Retornar array vacío en caso de fallo
    }
}

/**
 * Tarea principal de actualización. Se ejecuta cada 12 horas.
 */
export async function runCharacterUpdateTask() {
    
    console.log(`[CRON] Iniciando tarea de actualización de personajes (GraphQL) en: ${new Date().toISOString()}`);

    try {
        // 1. Obtener todos los IDs y datos actuales de la DB local
        const localCharacters = await Character.findAll({ attributes: ['id', 'status', 'species', 'gender', 'name', 'origin'] });
        const characterIds = localCharacters.map(char => char.id);
        
        if (characterIds.length === 0) {
            console.log('[CRON] No hay personajes en la base de datos local para actualizar.');
            return;
        }

        // 2. 🚨 Obtener los datos actualizados usando GraphQL
        const remoteCharacters = await fetchLatestDataGraphQL(characterIds);

        // 3. Comparar y actualizar (la lógica de comparación sigue siendo la misma)
        for (const remoteChar of remoteCharacters) {
            const localChar = localCharacters.find(lc => lc.id === remoteChar.id);

            if (localChar) {
                // Verificar si algún campo relevante ha cambiado
                const hasChanged = 
                    localChar.status !== remoteChar.status ||
                    localChar.species !== remoteChar.species ||
                    localChar.gender !== remoteChar.gender ||
                    localChar.name !== remoteChar.name ||
                    localChar.origin !== remoteChar.origin;

                if (hasChanged) {
                    // Si hay cambios, actualizar el registro
                    await Character.update(remoteChar, { where: { id: remoteChar.id } });
                    console.log(`[CRON] Personaje ID ${remoteChar.id} (${remoteChar.name}) actualizado mediante GraphQL.`);
                }
            }
        }

        console.log('[CRON] Tarea de actualización finalizada con éxito.');
        
    } catch (error) {
        console.error('[CRON] Error crítico durante la tarea de actualización:', error);
    }
}