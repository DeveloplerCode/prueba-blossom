// src/services/LoggerService.ts

import * as fs from 'fs';
import * as path from 'path';

// --- Configuración de Rutas ---
const BASE_LOGS_DIR = path.join(process.cwd(), 'logs');

/**
 * Servicio centralizado para escribir logs en archivos específicos.
 */
export class LoggerService {
    
    // El nombre del archivo de log, p. ej., 'db_errors.log'
    private fileName: string;
    private logFilePath: string;
    
    /**
     * @param fileName El nombre del archivo de log donde se escribirá.
     * @param subDir Directorio dentro de 'logs/' (opcional, p. ej., 'db' o 'middlewares').
     */
    constructor(fileName: string, subDir: string = '') {
        this.fileName = fileName;
        
        // Determina la ruta final de la carpeta de logs (logs/subDir)
        const logDir = subDir ? path.join(BASE_LOGS_DIR, subDir) : BASE_LOGS_DIR;
        this.logFilePath = path.join(logDir, this.fileName);
        
        // Asegura que la carpeta de logs exista al instanciar el servicio
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    /**
     * Escribe un mensaje de log formateado en el archivo.
     * @param data El objeto o cadena de datos a escribir en el log.
     * @param logLevel El nivel de log (ERROR, INFO, WARN).
     */
    public log(data: any, logLevel: 'ERROR' | 'INFO' | 'WARN' = 'INFO'): void {
        const timestamp = new Date().toISOString();
        
        let logContent: string;
        
        // Asegura que los objetos JSON se vean bien en el archivo de log
        if (typeof data === 'object' && data !== null) {
            logContent = JSON.stringify(data, null, 2);
        } else {
            logContent = String(data);
        }

        const logEntry = `
[${timestamp}] [${logLevel}]
${logContent}
`;

        // Escribir de forma asíncrona para no bloquear el hilo de ejecución
        fs.appendFile(this.logFilePath, logEntry, (err) => {
            if (err) {
                console.error(`❌ Error al escribir en el log (${this.fileName}):`, err);
            }
        });
    }

    /**
     * Método de conveniencia para errores (uso común)
     */
    public error(data: any): void {
        this.log(data, 'ERROR');
    }
}