const express = require('express');
const Joi = require('joi');

const { Team } = require('./src/Team');
const { Game } = require('./src/Game');
const { Result } = require('./src/Result');

const app = express();
app.use(express.json());

module.exports = Team;
const teams = [
  new Team(1, "Верес"),
  new Team(2, "Ворскла"),
  new Team(3, "Динамо"),
  new Team(4, "Колос"),
  new Team(5, "Металіст"),
  new Team(6, "Рух"),
  new Team(7, "Чорноморець"),
  new Team(8, "Шахтар"),
];

module.exports = Game;

const games = [
  {id:1, date:"2023-03-01", team1Id:1, team2Id:2, team1Score:1, team2Score:2},
  {id:2, date:"2023-03-02", team1Id:2, team2Id:3, team1Score:3, team2Score:3},
  {id:3, date:"2023-03-03", team1Id:1, team2Id:8, team1Score:12, team2Score:8},
  {id:4, date:"2023-03-04", team1Id:3, team2Id:4, team1Score:5, team2Score:1},
  {id:5, date:"2023-03-05", team1Id:3, team2Id:5, team1Score:7, team2Score:9},
  {id:6, date:"2023-03-06", team1Id:4, team2Id:1, team1Score:1, team2Score:6},
  {id:7, date:"2023-03-07", team1Id:5, team2Id:2, team1Score:8, team2Score:4},
  {id:8, date:"2023-03-08", team1Id:5, team2Id:7, team1Score:5, team2Score:0},
];

const results = [
  new Result(0, 0, 0),
  new Result(1, 1,1),
  new Result(2, 2,2),
  new Result(3, 3,3),
  new Result(4, 4,4),
  new Result(5, 5,5),
  new Result(6, 6,6),
  new Result(7, 7,7),
  new Result(8, 8,8),
  new Result(9, 9,9),
  new Result(10, 10,10),
];

app.get('/games', (req, res) => {
  res.status(200).send(games);
});

app.get('/games/:id', (req, res) => {
  const gameIndex = games.find((g) => g.id === parseInt(req.params.id, 10));
  if (!gameIndex) {
    return res.status(404).send('No games were found for this ID');
  }
  return res.status(200).send(gameIndex);
});

// Ендпоінт для отримання списку ігор з пагінацією
app.get('/pagination/games', (req, res) => {
  // отримуємо параметри запиту
  const page = parseInt(req.query.page, 10); // номер сторінки
  const limit = parseInt(req.query.limit, 10); // кількість елементів на сторінці

  // виконуємо пагінацію даних на основі параметрів запиту
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedGames = games.slice(startIndex, endIndex);

  // повертаємо результат у форматі JSON
  res.status(200).send(paginatedGames);
});

function validateGames(gameIndex) {
  const obj = Joi.object({
    date: Joi.string().required(),
    team1Id: Joi.number().integer().min(1).max(teams.length)
        .required(),
    team2Id: Joi.number().integer().min(1).max(teams.length)
        .required(),
    team1Score: Joi.number().integer().min(0).max(10)
        .required(),
    team2Score: Joi.number().integer().min(0).max(10)
        .required(),
  });

  return obj.validate(gameIndex);
}

app.post('/games', (req, res) => {
  const result = validateGames(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const game = {
    id: games.length + 1,
    date: req.body.date,
    team1Id: req.body.team1Id,
    team2Id: req.body.team2Id,
    team1Score: req.body.team1Score,
    team2Score: req.body.team2Score,
  };

  games.push(game);
  res.status(200).send(game);
});

app.put('/games/:id', (req, res) => {
  const gameIndex = games.find((g) => g.id === parseInt(req.params.id, 10));
  if (!gameIndex) {
    return res.status(404).send('No games were found for this ID');
  }

  const result = validateGames(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  gameIndex.date = req.body.date;
  gameIndex.team1Id = req.body.team1Id;
  gameIndex.team2Id = req.body.team2Id;
  gameIndex.team1Score = req.body.team1Score;
  gameIndex.team2Score = req.body.team2Score;

  res.status(200).send(gameIndex);
});

app.delete('/games/:id', (req, res) => {
  const gameIndex = games.find((g) => g.id === parseInt(req.params.id, 10));
  if (!gameIndex) {
    return res.status(404).send('No games were found for this ID');
  }

  const index = games.indexOf(gameIndex);
  games.splice(index, 1);

  res.status(200).send(gameIndex);
});

app.get('/teams/filter', (req, res) => {
  // отримуємо параметри запиту
  const queryName = req.query.name; // назва команди, яку шукаємо
  if (!queryName) {
    return res.status(400).send('Missing search query');
  }
  // фільтруємо дані на основі параметрів запиту
  const filteredTeams = teams.filter((team) => team.name.toLowerCase()
      .includes(queryName.toLowerCase()));
  if (filteredTeams.length <= 0) {
    return res.status(404).send('No teams found for this name');
  }
  // повертаємо результат
  return res.status(200).send(filteredTeams);
});

app.get('/teams/:id', (req, res) => {
  const teamIndex = teams.find((t) => t.id === parseInt(req.params.id, 10));
  if (!teamIndex) {
    return res.status(404).send('No teams were found for this ID');
  }
  return res.status(200).status(200).send(teamIndex);
});

function validateTeams(teamIndex) {
  const obj = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });

  return obj.validate(teamIndex);
}

app.post('/teams', (req, res) => {
  const result = validateTeams(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const team = {
    id: teams.length + 1,
    name: req.body.name,
  };

  teams.push(team);
  res.status(200).send(team);
});

app.put('/teams/:id', (req, res) => {
  const teamIndex = teams.find((t) => t.id === parseInt(req.params.id, 10));
  if (!teamIndex) {
    return res.status(404).send('No teams were found for this ID');
  }

  const result = validateTeams(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  teamIndex.name = req.body.name;

  res.status(200).send(teamIndex);
});

app.delete('/teams/:id', (req, res) => {
  const teamIndex = teams.find((t) => t.id === parseInt(req.params.id, 10));
  if (!teamIndex) {
    return res.status(404).send('No teams were found for this ID');
  }

  const index = teams.indexOf(teamIndex);
  teams.splice(index, 1);

  res.status(200).send(teamIndex);
});

app.get('/results', (req, res) => {
  res.status(200).send(results);
});

function validateResult(resultIndex) {
  const obj = Joi.object({
    team1Score: Joi.number().integer().min(0).max(100)
        .required(),
    team2Score: Joi.number().integer().min(0).max(100)
        .required(),
  });

  return obj.validate(resultIndex);
}

app.post('/results', (req, res) => {
    const result = validateResult(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    const newResult = {
        id: results.length + 1,
        team1Score: req.body.team1Score,
        team2Score: req.body.team2Score,
    };

    results.push(newResult);
    res.status(200).send(result);
});

app.put('/results/:id', (req, res) => {
    const resultIndex = results.find((r) => r.id === parseInt(req.params.id, 10));
    if (!resultIndex) {
        return res.status(404).send('No results were found for this ID');
    }

    const result = validateResult(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    resultIndex.team1Score = req.body.team1Score;
    resultIndex.team2Score = req.body.team2Score;

    res.status(200).send(resultIndex);
});

app.delete('/results/:id', (req, res) => {
    const resultIndex = results.find((r) => r.id === parseInt(req.params.id, 10));
    if (!resultIndex) {
        return res.status(404).send('No results were found for this ID');
    }

    const index = results.indexOf(resultIndex);
    results.splice(index, 1);

    res.status(200).send(resultIndex);
});

app.listen(3030, () => {
  console.log('Server running at http://localhost:3030/');
});