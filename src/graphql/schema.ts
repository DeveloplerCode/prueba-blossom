// src/graphql/schema.ts

import { buildSchema } from 'graphql';

// Definición del Esquema GraphQL
export const schema = buildSchema(`
    type Character {
        id: Int!
        name: String!
        status: String!
        species: String!
        gender: String!
        origin: String!
    }

    type Query {
        # La consulta principal que permite todos los filtros
        searchCharacters(
            status: String, 
            species: String, 
            gender: String, 
            name: String, 
            origin: String
        ): [Character]
    }
`);