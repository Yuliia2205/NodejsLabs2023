const { Connection, Request, TYPES } = require('tedious');

class TeamController {
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

    getAllTeams(req, res) {
        const teams = [];
        const request = new Request('SELECT * FROM Team', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send(teams);
        });

        request.on('row', (columns) => {
            const team = {
                id: columns[0].value,
                name: columns[1].value,
            };
            teams.push(team);
        });

        this.connection.execSql(request);
    }

    getTeamById(req, res) {
        const teams = [];
        const teamId = parseInt(req.params.id, 10);
        const request = new Request('SELECT * FROM Team WHERE id = @id', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Team not found');
            }

            res.status(200).send(teams);
        });

        request.addParameter('id', TYPES.Int, teamId);
        request.on('row', (columns) => {
            const team = {
                id: columns[0].value,
                name: columns[1].value,
            };
            teams.push(team);
        });

        this.connection.execSql(request);
    }

    createTeam(req, res) {
        const { name } = req.body;

        const request = new Request('INSERT INTO Team (name) VALUES (@name); SELECT SCOPE_IDENTITY() AS teamId;', (err, rowCount, rows) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            const team = {
                name: name,
            };

            res.status(201).send(team);
        });

        request.addParameter('name', TYPES.VarChar, name);

        this.connection.execSql(request);
    }

    updateTeam(req, res) {
        const teamId = parseInt(req.params.id, 10);
        const { name } = req.body;

        const request = new Request('UPDATE Team SET name = @name WHERE id = @id', (err, rowCount) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Team not found');
            }

            res.sendStatus(201).json("Team updated");
        });

        request.addParameter('id', TYPES.Int, teamId);
        request.addParameter('name', TYPES.VarChar, name);

        this.connection.execSql(request);
    }

    deleteTeam(req, res) {
        const teamId = parseInt(req.params.id, 10);

        const request = new Request('DELETE FROM Team WHERE id = @id', (err, rowCount) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (rowCount === 0) {
                return res.status(404).send('Team not found');
            }

            res.sendStatus(204);
        });

        request.addParameter('id', TYPES.Int, teamId);

        this.connection.execSql(request);
    }
}

module.exports = TeamController;
