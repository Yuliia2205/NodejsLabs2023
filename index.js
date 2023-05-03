const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const initializePassport = require("./src/passport-config");
const { Team } = require("./src/Team");
const { Game } = require("./src/Game");
const { Result } = require("./src/Result");

const app = express();

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
  new Result(0, 0),
  new Result(1, 1),
  new Result(2, 2),
  new Result(3, 3),
  new Result(4, 4),
  new Result(5, 5),
  new Result(6, 6),
  new Result(7, 7),
  new Result(8, 8),
  new Result(9, 9),
  new Result(10, 10),
];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

initializePassport(passport);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Функція middleware для перевірки автентичності користувача
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/login", (req, res) => {
  res.render("login");
});

// Обробляти запит на вхід
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  })
);

// Обробляти запит на вихід
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// Захищений маршрут - доступний лише авторизованим користувачам
app.get("/admin", isAuth, (req, res) => {
  const teamQuery = req.query.team;
  let filteredGames = games;
  if (teamQuery) {
    const team = teams.find((t) => t.name === teamQuery);
    if (team) {
      filteredGames = games.filter(
        (g) => g.team1Id === team.id || g.team2Id === team.id
      );
    } else {
      filteredGames = [];
    }
  }
  res.render("admin", { teams, games: filteredGames, results });
});

app.get("/", (req, res) => {
  const teamQuery = req.query.team;
  let filteredGames = games;
  if (teamQuery) {
    const team = teams.find((t) => t.name === teamQuery);
    if (team) {
      filteredGames = games.filter(
        (g) => g.team1Id === team.id || g.team2Id === team.id
      );
    } else {
      filteredGames = [];
    }
  }
  res.render("guest", { teams, games: filteredGames, results });
});

app.post("/games", (req, res) => {
  const { date, team1Id, team2Id, team1Score, team2Score } = req.body;
  const newGameId = games.length + 1;
  games.push({
    id: newGameId,
    date,
    team1Id: parseInt(team1Id, 10),
    team2Id: parseInt(team2Id, 10),
    team1Score: parseInt(team1Score, 10),
    team2Score: parseInt(team2Score, 10),
  });
  res.redirect("admin");
});

app.post("/teams", (req, res) => {
  const { name } = req.body;
  // Перевіряємо, чи існує команда з введеною назвою в масиві
  const existingTeamIndex = teams.findIndex((team) => team.name === name);
  if (existingTeamIndex !== -1) {
    // Якщо команда існує, то видаляємо її з масиву
    teams.splice(existingTeamIndex, 1);
  } else {
    // Якщо команда не існує, то додаємо її до масиву
    const newTeamId = teams.length + 1;
    teams.push(new Team(newTeamId, name));
  }
  res.redirect("/admin");
});

// Відображення форми редагування команди
app.post("/teams/edit", (req, res) => {
  const teamName = req.params.name;
  const team = teams.find((t) => t.name === teamName);
  res.render("teamEdit", { team });
});

app.post("/team", (req, res) => {
  const searchTeam = req.body.name;
  if (!searchTeam) {
    return res.status(400).send("Missing search query");
  }
  const nameTeam = teams.find((t) => t.name === searchTeam);

  if (!nameTeam) {
    return res.status(404).send(`No games found for team '${searchTeam}'`);
  }
  const teamGames = games.filter(
    (game) => game.team1Id === nameTeam.id || game.team2Id === nameTeam.id
  );

  res.render("team", { teams, team: nameTeam, games: teamGames });
});

app.use(express.static("public"));

app.listen(3030, () => {
  console.log("Server running at http://localhost:3030/");
});