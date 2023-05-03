const LocalStrategy = require('passport-local').Strategy;

const users = [
  {
    username: 'admin',
    password: 'password',
    id: 1,
  },
];

function initialize(passport) {
  const authenticateUser = (username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: 'Invalid username' });
    }

    if (user.password !== password) {
      return done(null, false, { message: 'Invalid password' });
    }

    return done(null, user);
  };

  passport.use(
    new LocalStrategy({ usernameField: 'username' }, authenticateUser),
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    return done(null, user);
  });
}

module.exports = initialize;
