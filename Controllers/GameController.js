const { Connection, Request, TYPES } = require('tedious');
class GameController {
    constructor(config) {
        this.config = config;
        // Підключення до бази даних
        this.connection = new Connection(config);
        this.connection.on('connect', (err) => {
            if (err) {
                console.error('Error connecting to database:', err);
            } else {
                console.log('Connected to database');
            }
        });
    }

    getAllGames(req, res) {
        const games = [];
        const request = new Request('SELECT * FROM Game', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send(games);
        });

        request.on('row', (columns) => {
            // Обробка кожного рядка результатів
            const game = {
                id: columns[0].value,
                date: columns[1].value,
                team1Id: columns[2].value,
                team2Id: columns[3].value,
                team1Score: columns[4].value,
                team2Score: columns[5].value,
            };
            games.push(game);
        });

        this.connection.execSql(request);
    }


    // Ендпоінт для отримання ігри за ID
    getGameById(req, res) {
        const gameId = parseInt(req.params.id, 10);
        const games = [];
        const request = new Request('SELECT * FROM Game WHERE id = @id', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Game not found');
            }

            res.status(200).json(games);
        });

        request.addParameter('id', TYPES.Int, gameId);
        request.on('row', (columns) => {
            // Обробка кожного рядка результатів
            const game = {
                id: columns[0].value,
                date: columns[1].value,
                team1Id: columns[2].value,
                team2Id: columns[3].value,
                team1Score: columns[4].value,
                team2Score: columns[5].value,
            };
            games.push(game);
        });

        this.connection.execSql(request);
    }

    createGame(req, res) {
        const { date, team1Id, team2Id, team1Score, team2Score } = req.body;

        const request = new Request('INSERT INTO Game (date, team1Id, team2Id, team1Score, team2Score) VALUES (@date, @team1Id, @team2Id, @team1Score, @team2Score); SELECT SCOPE_IDENTITY() AS gameId;', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json("done");
        });

        request.addParameter('date', TYPES.Date, date);
        request.addParameter('team1Id', TYPES.Int, team1Id);
        request.addParameter('team2Id', TYPES.Int, team2Id);
        request.addParameter('team1Score', TYPES.Int, team1Score);
        request.addParameter('team2Score', TYPES.Int, team2Score);

        this.connection.execSql(request);
    }

    updateGame(req, res) {
        const gameId = parseInt(req.params.id, 10);
        const { date, team1Id, team2Id, team1Score, team2Score } = req.body;

        const request = new Request('UPDATE Game SET date = @date, team1Id = @team1Id, team2Id = @team2Id, team1Score = @team1Score, team2Score = @team2Score WHERE id = @id', (err, rowCount) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Game not found');
            }

            res.sendStatus(204);
        });

        request.addParameter('id', TYPES.Int, gameId);
        request.addParameter('date', TYPES.Date, date);
        request.addParameter('team1Id', TYPES.Int, team1Id);
        request.addParameter('team2Id', TYPES.Int, team2Id);
        request.addParameter('team1Score', TYPES.Int, team1Score);
        request.addParameter('team2Score', TYPES.Int, team2Score);

        this.connection.execSql(request);
    }

    deleteGame(req, res) {
        const gameId = parseInt(req.params.id, 10);

        const request = new Request('DELETE FROM Game WHERE id = @id', (err, rowCount) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Game not found');
            }

            res.sendStatus(204);
        });

        request.addParameter('id', TYPES.Int, gameId);

        this.connection.execSql(request);
    }


}
module.exports = GameController;
