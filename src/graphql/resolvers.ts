// src/graphql/resolvers.ts

import { ICharacterFilters } from '../commons/interfaces/Iservices';
import { characterService } from '../services/CharacterService';

const rootResolver = {
    searchCharacters: async (args: ICharacterFilters) => {
        // Buscar en local (Redis + DB)
        const localResults = await characterService.searchLocalCharacters(args);

        if (localResults && localResults.length > 0) {
            return localResults;
        }

        console.log("⚠️ No hay resultados en la DB, buscando en API externa...");

        // Llamar a la API externa
        const externalResults = await characterService.searchExternalAPI(args);

        // Guardar en la DB y retornar
        const stored = await characterService.saveExternalCharacters(externalResults.results);

        return stored;
    }
};

export default rootResolver;
