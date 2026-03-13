const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env si existe
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/app-polla';
console.log('Connecting to:', MONGODB_URI);

const GameSchema = new mongoose.Schema({
    group: { type: String, required: true },
    phase: { type: Number, required: true }
});

const Game = mongoose.model('Game_Check', GameSchema, 'games');

async function checkGroups() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
        console.log('Connected!');
        
        const groups = await Game.distinct('group');
        console.log('Distinct groups:', groups);
        
        const phases = await Game.distinct('phase');
        console.log('Distinct phases:', phases);

        // Also check if there's a "FINAL" group or phase
        const finalGames = await Game.find({ group: 'FINAL' });
        console.log('Games with group FINAL:', finalGames.length);

        const allGames = await Game.find({}, 'group phase').lean();
        const groupSet = new Set();
        allGames.forEach(g => {
            if (g.group) groupSet.add(g.group);
        });
        console.log('Manual Group Set:', Array.from(groupSet));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkGroups();
