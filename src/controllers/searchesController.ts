import { Request, Response } from 'express';
import { json } from 'sequelize/types';
import Search from '../models/Character';




export const getSearch = async( req: Request , res: Response ) => {

    const { id } = req.params;

    const usuario = await Search.findByPk( id );

    if( usuario ) {
        res.json(usuario);
    } else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${ id }`
        });
    }


}



