// config.js
import Joi from 'joi';
import 'dotenv/config'; // Importación moderna y simple de dotenv

// Define el esquema de validación
const envSchema = Joi.object({
    // Variable REQUERIDA. Si falta, la validación fallará.
    DB_PASSWORD: Joi.string().optional().allow(''),
    DB_DIALECT: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().integer().required(),


    REDIS_URL: Joi.string().required(), 

    // Variable con VALOR POR DEFECTO. Si no está en .env, usa 3000.
    PORT: Joi.number().integer().default(3001), 

    // Variable opcional. No tiene por defecto, pero no es obligatoria.
    LOG_LEVEL: Joi.string().valid('info', 'warn', 'error').optional(),

    // Valor por defecto para el entorno
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development')

// Permite otras variables en process.env que no estén explícitamente listadas
}).unknown(true); 

// Valida las variables de entorno
const { error, value: validatedEnv } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Error de validación de configuración: ${error.message}`);
}

export const config = validatedEnv