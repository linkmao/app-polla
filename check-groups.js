const mongoose = require('mongoose');
const Game = require('./src/models/Game');
const dotenv = require('dotenv');
dotenv.config();

async function checkGroups() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/app-polla');
    const groups = await Game.distinct('group');
    console.log('Groups found:', groups);
    const count = await Game.countDocuments();
    console.log('Total games:', count);
    const allGames = await Game.find({}, 'group gameNumber').lean();
    console.log('All games groups:', allGames.map(g => g.group));
    process.exit(0);
}

checkGroups().catch(err => {
    console.error(err);
    process.exit(1);
});
