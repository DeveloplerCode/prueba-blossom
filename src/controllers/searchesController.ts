import { Request, Response } from 'express';
// import { searchCharacters } from '../graphql';
import { ICharacterFilters } from '../commons/interfaces/Iservices';
import rootResolver from '../graphql/resolvers';

export const getSearch = async (req: Request, res: Response) => {
    
    // Extraemos los filtros directamente del query string
    const { name, status, species, gender, origin } = req.query;

    const filters: ICharacterFilters = {};
    if (name) filters.name = String(name);
    if (status) filters.status = String(status);
    if (species) filters.species = String(species);
    if (gender) filters.gender = String(gender);
    if (origin) filters.origin = String(origin);

    try {
        const characters = await rootResolver.searchCharacters(filters);

        return res.json(characters);

    } catch (error: any) {
        console.error(error);
        if (error.status) {
            res.status(error.status).json({ msg: error.msg, errors: error.errors });
        } else {
            res.status(500).json({ msg: 'Ocurrió un error inesperado durante la búsqueda.' });
        }
    }
};
