const express = require('express');

const GameController = require('./Controllers/GameController');
const TeamController = require('./Controllers/TeamController');
const PlayerController = require('./Controllers/PlayerController');
const SQLRequestController = require('./Controllers/SQLRequestController');

const app = express();
app.use(express.json());


const config = {
    authentication: {
        options: {
            userName: 'ProgramUser',
            password: '123'
        },
        type: 'default'
    },
    server: 'localhost',
    options: {
        database: 'Football',
        encrypt: true,
        trustServerCertificate: true
    }
};

const gameController = new GameController(config);
const teamController = new TeamController(config);
const playerController = new PlayerController(config);
const sqlRequestController = new SQLRequestController(config);
// Ендпоінти для роботи з іграми
app.get('/games', gameController.getAllGames.bind(gameController));
app.get('/games/:id', gameController.getGameById.bind(gameController));
app.post('/games', gameController.createGame.bind(gameController));
app.put('/games/:id', gameController.updateGame.bind(gameController));
app.delete('/games/:id', gameController.deleteGame.bind(gameController));

// Ендпоінти для роботи з командами
app.get('/teams', teamController.getAllTeams.bind(teamController));
app.get('/teams/:id', teamController.getTeamById.bind(teamController));
app.post('/teams', teamController.createTeam.bind(teamController));
app.put('/teams/:id', teamController.updateTeam.bind(teamController));
app.delete('/teams/:id', teamController.deleteTeam.bind(teamController));

// Ендпоінти для роботи з гравцями
app.get('/players', playerController.getAllPlayers.bind(playerController));
app.get('/players/:id', playerController.getPlayerById.bind(playerController));
app.post('/players', playerController.createPlayer.bind(playerController));
app.put('/players/:id', playerController.updatePlayer.bind(playerController));
app.delete('/players/:id', playerController.deletePlayer.bind(playerController));

// Ендпоінти для роботи з SQL запитами
app.get('/getGamesByPlayerId/:id', sqlRequestController.getGamesByPlayerId.bind(sqlRequestController));
app.get('/getPlayersByTeamId/:id', sqlRequestController.getPlayersByTeamId.bind(sqlRequestController));

app.listen(3030, () => {
  console.log('Server running at http://localhost:3030/');
  gameController.connection.connect();
  teamController.connection.connect();
  playerController.connection.connect();
    sqlRequestController.connection.connect();
});

app.on('close', () => {
  gameController.connection.close();
  teamController.connection.close();
  playerController.connection.close();
    sqlRequestController.connection.close();
}