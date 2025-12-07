export interface ICharacterFilters {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    origin?: string; // Incluimos el filtro de origen para la DB
    source?: 'db' | 'api' | 'mixed'; // Nuevo filtro para decidir la fuente
}