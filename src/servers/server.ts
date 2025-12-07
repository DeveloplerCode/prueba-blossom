import express, { Application } from 'express';
import searchRoutes from '../routes/searches';
import cors from 'cors';

import conexion from '../databases/connection';
import { config } from '../config/config';
import { loggerMiddleware } from '../middlewares';
import { connectRedis } from '../databases/redis';

import cron from 'node-cron';

import { runCharacterUpdateTask } from '../services/CharacterUpdater'; // Asumo que es el nombre de la función


// Importación de Swagger
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../config/swagger.json';

class Server {

    private app: Application;
    private port: string;
    private apiPaths = {
        searches: '/v1/api/searches',
        docs: '/docs'
    }

    constructor() {
        this.app  = express();
        this.port = config.PORT;

        // Métodos iniciales
        this.dbConnection();
        this.redisConnection();
        this.middlewares();
        this.routes();
        this.cronJobs();
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

        this.app.use( this.apiPaths.searches, searchRoutes )

        this.app.use(
            this.apiPaths.docs, 
            swaggerUi.serve, 
            swaggerUi.setup(swaggerDocument)
        );

    }

    cronJobs() {

      
        // 1. Programar la tarea
        // cron.schedule(config.CRON_SCHEDULE_TIME, () => {
        //     // La función que contiene la lógica de actualización
        //     runCharacterUpdateTask(); 
        // }, {
        //     // Es buena práctica definir la zona horaria para evitar desfases
        //     timezone: config.TIMEZONE // Ajústalo a tu zona horaria de preferencia
        // });
        

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server running on port ' + this.port );
        })
    }

}

export default Server;