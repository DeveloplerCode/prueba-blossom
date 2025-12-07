import express, { Application } from 'express';
import userRoutes from '../routes/searches';
import cors from 'cors';

import conexion from '../databases/connection';
import { config } from '../config/config';
import { loggerMiddleware } from '../middlewares';
import { connectRedis } from '../databases/redis';

// ss

class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        searches: '/v1/api/searches'
    }

    constructor() {
        this.app  = express();
        this.port = config.PORT;

        // Métodos iniciales
        this.dbConnection();
        this.redisConnection();
        this.middlewares();
        this.routes();
    } 

    async dbConnection() {

        try {
            
            await conexion.authenticate();
            console.log('Database is connected status: online');

        } catch (error: unknown) {
            throw new Error( String(error) );
        }

    }
    async redisConnection() {

        try {
            
            // Conexión a Redis
            await connectRedis();
            console.log('Database redis is connected status: online');

        } catch (error: unknown) {
            throw new Error( String(error) );
        }

    }

    middlewares() {


        // CORS
        this.app.use( cors() );

        //CUSTOM MIDDLEWARES
        this.app.use(loggerMiddleware);

        // Lectura del body
        this.app.use( express.json() );

        // Carpeta pública
        this.app.use( express.static('public') );
    }


    routes() {
        this.app.use( this.apiPaths.searches, userRoutes )
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running on port ' + this.port );
        })
    }

}

export default Server;