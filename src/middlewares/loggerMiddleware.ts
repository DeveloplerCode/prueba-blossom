import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from '../services';




// Instancia el Logger SÓLO una vez, apuntando a logs/middlewares/requests.log
const middlewareLogger = new LoggerService('requests.log', 'middlewares');

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const start = process.hrtime();
    
    // Función para obtener información del cuerpo de forma segura
    const getBodyInfo = () => {
        // Usa el fallback {} para evitar el error 'Cannot convert undefined or null to object'
        const body = req.body || {}; 
        const bodyKeys = Object.keys(body);
        
        if (bodyKeys.length > 0) {
            // Limita la longitud del cuerpo para evitar archivos de log gigantes
            const bodyString = JSON.stringify(body, null, 2); 
            return bodyString.substring(0, 500) + (bodyString.length > 500 ? '...' : '');
        }
        return 'N/A';
    };

    // La función que se ejecutará al finalizar la petición
    res.on('finish', () => {
        const end = process.hrtime(start);
        const durationInMs = (end[0] * 1000) + (end[1] / 1e6);
        
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.originalUrl;
        const ip = req.ip || req.socket.remoteAddress;
        const userAgent = req.get('user-agent');
        const statusCode = res.statusCode;
        const bodyContent = getBodyInfo();
        
        // --- Contenido del Log (Formato Bonito) ---
        const logEntry = `
            ====================================================
            [${timestamp}] 
            - Petición: ${method} ${url}
            - IP Cliente: ${ip}
            - Código de Estado: ${statusCode}
            - Tiempo de Respuesta: ${durationInMs.toFixed(3)}ms
            - User Agent: ${userAgent}
            - Cuerpo de la Petición: 
            ${bodyContent}
            ====================================================
            `;
        
        // 1. Imprimir en consola (para desarrollo)
        console.log(logEntry); 
       
        // 2. Escribir en el archivo de log usando el LoggerService
        
        // 🚨 Llamada al servicio centralizado para escribir el log
        middlewareLogger.log(logEntry, 'INFO');
        
    });

    next();
};