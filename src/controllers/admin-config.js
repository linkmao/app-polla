const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const configPath = path.join(__dirname, '../config/config.json');

// Mapeo de nombres descriptivos para la interfaz
const configLabels = {
    secretword: "Palabra Secreta JWT",
    tokenDuration: "Duración del Token (segundos)",
    pointByScore: "Puntos por Marcador Exacto",
    pointByAnalogScore: "Puntos por Ganador/Empate (Fase Grupos)",
    pointByGroupClassification: "Puntos por Clasificado Grupo (Posición Exacta)",
    pointByTeamClassificated: "Puntos por Equipo Clasificado (Cualquier Posición)",
    pointByFinalistFirstTeam: "Puntos por Campeón",
    pointByFinalistSecondTeam: "Puntos por Subcampeón",
    pointByFinalistThirdTeam: "Puntos por Tercer Puesto",
    pointByFinalistFourthTeam: "Puntos por Cuarto Puesto",
    phaseInitial: "ID Fase Inicial",
    phaseSixteenth: "ID Fase Dieciseisavos",
    phaseEighth: "ID Fase Octavos",
    phaseFourth: "ID Fase Cuartos",
    phaseSemiFinals: "ID Fase Semifinal",
    phaseFinal: "ID Fase Final",
    gamePhantom: "ID Juego Fantasma (Virtual)",
    initDateTournament: "Fecha Inicio Torneo (YYYY-MM-DDTHH:mm:ss)",
    viewInitDateTournament: "Mostrar Contador Regresivo Torneo",
    closeBetGroups: "Fecha Cierre Apuestas Grupos (YYYY-MM-DDTHH:mm:ss)",
    viewCloseBetGroups: "Mostrar Contador Cierre Grupos",
    closeBetPhases: "Fecha Cierre Apuestas Fases (YYYY-MM-DDTHH:mm:ss)",
    viewCloseBetPhases: "Mostrar Contador Cierre Fases",
    renderGuestInfo: "Mostrar Información de Invitado (Login)",
    renderButtonRegister: "Habilitar Botón de Registro",
    renderBetRoundGroup: "Habilitar Apuestas de Grupos",
    renderViewOtherBetGroup: "Ver Apuestas de Otros (Grupos)",
    enableMenuRoundPhases: "Habilitar Menú de Fases",
    renderBetRoundPhases: "Habilitar Apuestas de Fases",
    renderViewOtherBetPhases: "Ver Apuestas de Otros (Fases)",
    renderViewOtherBetClassFinal: "Ver Apuestas de Otros (Clasificación Final)",
    // Los arrays y objetos se manejarán como strings JSON en el formulario por simplicidad si es necesario, 
    // pero intentaremos que sean editables.
    gamesSixteenth: "Estructura Juegos Dieciseisavos (JSON)",
    gamesEighth: "Estructura Juegos Octavos (JSON)",
    gamesFourth: "Estructura Juegos Cuartos (JSON)",
    gamesSemi: "Estructura Juegos Semifinal (JSON)",
    finalStruct: "Estructura Juegos Final (JSON)",
    xPointByScore: "Posición Puntos Marcador",
    xPointByAnalogScore: "Posición Puntos Análogos",
    xPointByLocalEqual: "Posición Puntos Local Empate",
    xPointByVisitEqual: "Posición Puntos Visita Empate",
    xPointByFirst: "Posición Puntos Primero",
    xPointBySecond: "Posición Puntos Segundo",
    xPointByThirdh: "Posición Puntos Tercero",
    xPointByFourth: "Posición Puntos Cuarto"
};

const getConfig = (req, res) => {
    // Definición de categorías
    const categories = {
        "Puntajes y Reglas": [],
        "Fechas y Límites": [],
        "Banderas de Visualización": [],
        "Estructura de Juego": [],
        "Sistema y Seguridad": []
    };

    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            let value = config[key];
            let type = typeof value;
            let isArray = Array.isArray(value);

            // Convertimos arrays a string para el textarea
            if (isArray || type === 'object') {
                value = JSON.stringify(value);
                type = 'json';
            }

            const item = {
                key,
                label: configLabels[key] || key,
                value,
                type,
                isBoolean: type === 'boolean',
                isNumber: type === 'number',
                isString: type === 'string' && !configLabels[key]?.includes('Fecha'),
                isDate: configLabels[key]?.includes('Fecha'),
                isJson: type === 'json'
            };

            // Clasificación por categoría
            if (key.startsWith('pointBy') || key.startsWith('xPointBy')) {
                categories["Puntajes y Reglas"].push(item);
            } else if (key.includes('Date') || key.includes('closeBet')) {
                categories["Fechas y Límites"].push(item);
            } else if (key.startsWith('render') || key.startsWith('enable') || key.startsWith('view')) {
                categories["Banderas de Visualización"].push(item);
            } else if (key.startsWith('phase') || key.startsWith('games') || key === 'finalStruct' || key === 'gamePhantom') {
                categories["Estructura de Juego"].push(item);
            } else {
                categories["Sistema y Seguridad"].push(item);
            }
        }
    }

    // Convertimos el objeto de categorías a un array para facilitar el loop en hbs
    const groupedConfig = Object.keys(categories).map(catName => ({
        name: catName,
        items: categories[catName]
    })).filter(cat => cat.items.length > 0);

    res.render('admin/config', { groupedConfig });
};

const updateConfig = (req, res) => {
    const newConfig = req.body;
    const updatedValues = {};

    // Procesamos cada valor según su tipo original en config
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            let value = newConfig[key];

            if (typeof config[key] === 'boolean') {
                value = value === 'on' || value === 'true';
            } else if (typeof config[key] === 'number') {
                value = Number(value);
            } else if (Array.isArray(config[key]) || typeof config[key] === 'object') {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.error(`Error parseando JSON para ${key}:`, e);
                    value = config[key]; // Mantenemos el anterior en caso de error
                }
            }
            
            updatedValues[key] = value;
        }
    }

    // Actualizamos el objeto en memoria
    Object.assign(config, updatedValues);

    // Guardamos en el archivo JSON
    try {
        fs.writeFileSync(configPath, JSON.stringify(updatedValues, null, 2), 'utf8');
        req.flash('mensajeOk', 'Configuración actualizada correctamente');
    } catch (error) {
        console.error("Error guardando config.json:", error);
        req.flash('mensajeError', 'Error al guardar la configuración');
    }

    res.redirect('/admin/config');
};

module.exports = {
    getConfig,
    updateConfig
};
