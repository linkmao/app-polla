const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

/**
 * Carga la configuración desde el archivo JSON.
 * Si el archivo no existe o hay un error, se podría manejar aquí.
 */
const loadConfig = () => {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error cargando config.json:", error);
        return {};
    }
};

const config = loadConfig();

module.exports = config;