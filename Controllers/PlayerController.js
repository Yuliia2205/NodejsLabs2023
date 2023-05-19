const { Connection, Request, TYPES } = require('tedious');

class PlayerController {
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

    getAllPlayers(req, res) {
        const players = [];
        const request = new Request('SELECT * FROM Player', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send(players);
        });

        request.on('row', (columns) => {
            const player = {
                id: columns[0].value,
                name: columns[1].value,
                teamId: columns[2].value,
            };
            players.push(player);
        });

        this.connection.execSql(request);
    }

    getPlayerById(req, res) {
        const players = [];
        const playerId = parseInt(req.params.id, 10);
        const request = new Request('SELECT * FROM Player WHERE id = @id', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Player not found');
            }

            res.status(200).send(players);
        });

        request.addParameter('id', TYPES.Int, playerId);
        request.on('row', (columns) => {
            const player = {
                id: columns[0].value,
                name: columns[1].value,
                teamId: columns[2].value,
            };
            players.push(player);
        });

        this.connection.execSql(request);
    }

    createPlayer(req, res) {
        const { name, teamId } = req.body;

        const request = new Request('INSERT INTO Player (name, teamId) VALUES (@name, @teamId); SELECT SCOPE_IDENTITY() AS playerId;', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            const player = {
                name: name,
                teamId: teamId,
            };

            res.status(201).send(player);
        });

        request.addParameter('name', TYPES.VarChar, name);
        request.addParameter('teamId', TYPES.Int, teamId);

        this.connection.execSql(request);
    }

    updatePlayer(req, res) {
        const playerId = parseInt(req.params.id, 10);
        const { name, teamId } = req.body;

        const request = new Request('UPDATE Player SET name = @name, teamId = @teamId WHERE id = @id', (err, rowCount) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Player not found');
            }

            res.sendStatus(204);
        });

        request.addParameter('id', TYPES.Int, playerId);
        request.addParameter('name', TYPES.VarChar, name);
        request.addParameter('teamId', TYPES.Int, teamId);

        this.connection.execSql(request);
    }

    deletePlayer(req, res) {
        const playerId = parseInt(req.params.id, 10);

        const request = new Request('DELETE FROM Player WHERE id = @id', (err, rowCount) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Player not found');
            }

            res.sendStatus(204);
        });

        request.addParameter('id', TYPES.Int, playerId);

        this.connection.execSql(request);
    }
}

module.exports = PlayerController;
