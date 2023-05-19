const { Connection, Request, TYPES } = require('tedious');

class SQLRequestController {
    constructor(config) {
        this.config = config;
        this.connection = new Connection(config);

        this.connection.on('connect', (err) => {
            if (err) {
                console.error('Error connecting to database:', err);
            } else {
                console.log('Connected to database');
            }
        });
    }

    getGamesByPlayerId(req, res) {
        const playerId = parseInt(req.params.id, 10);

        const games = [];
        const request = new Request(
            `SELECT Game.id, Game.date, Game.team1Score, Game.team2Score
       FROM Game
       JOIN Team ON Game.team1Id = Team.id OR Game.team2Id = Team.id
       JOIN Player ON Player.teamId = Team.id
       WHERE Player.id = @playerId`,
            (err, rowCount) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).send('Internal Server Error');
                }

                return res.status(200).send(games);
            }
        );

        request.addParameter('playerId', TYPES.Int, playerId);

        request.on('row', (columns) => {
            const game = {
                id: columns[0].value,
                date: columns[1].value,
                team1Score: columns[2].value,
                team2Score: columns[3].value,
            };
            games.push(game);
        });

        this.connection.execSql(request);
    }

    getPlayersByTeamId(req, res) {
        const teamId = parseInt(req.params.id, 10);

        const players = [];
        const request = new Request(
            `SELECT Player.name
       FROM Player
       WHERE Player.teamId = @teamId`,
            (err, rowCount) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).send('Internal Server Error');
                }

                return res.status(200).send(players);
            }
        );

        request.addParameter('teamId', TYPES.Int, teamId);

        request.on('row', (columns) => {
            const player = {
                name: columns[0].value,
            };
            players.push(player);
        });

        this.connection.execSql(request);
    }
}

module.exports = SQLRequestController;
