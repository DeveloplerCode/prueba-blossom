// src/decorators/measureTime.ts

/**
 * Decorador de método que mide y registra el tiempo de ejecución (en milisegundos)
 * de la función decorada.
 */
export function measureTime() {
    // target: El prototipo de la clase (para métodos de instancia)
    // propertyKey: El nombre del método ('searchCharacters')
    // descriptor: Las propiedades del método (value, writable, etc.)
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        
        // 1. Guardar la función original
        const originalMethod = descriptor.value;

        // 2. Reemplazar la función original con una nueva
        descriptor.value = async function (...args: any[]) {
            
            // 🚨 Inicio de la medición
            const start = performance.now(); // Usamos performance.now() para alta precisión

            let result;
            try {
                // 3. Ejecutar la función original
                // 'this' se enlaza a la instancia de la clase donde se aplica el decorador
                result = await originalMethod.apply(this, args);
            } catch (error) {
                // Asegurar que los errores se propaguen después de la medición si es necesario
                throw error;
            } finally {
                // 4. Fin de la medición
                const end = performance.now();
                const executionTime = end - start;

                // 5. Imprimir el resultado
                console.log(`⏱️ Decarator  Método '${propertyKey}' ejecutado en: ${executionTime.toFixed(3)}ms`);
            }
            
            // 6. Retornar el resultado de la función original
            return result;
        };

        // Retornar el descriptor modificado
        return descriptor;
    };
}