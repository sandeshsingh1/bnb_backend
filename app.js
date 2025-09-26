const express = require('express');
const path = require('path');
const session = require('express-session');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const hostRouter = require('./routes/hostRouter');
const UserModel = require('./models/user'); // import user model

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'change_this_secret_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// ✅ middleware to inject logged-in user name
app.use((req, res, next) => {
  if (req.session.userId) {
    const user = UserModel.getById(req.session.userId);
    res.locals.currentUser = user ? user.username : null; // 👈 fix: username
  } else {
    res.locals.currentUser = null;
  }
  next();
});

// routers
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/host', hostRouter);

// 404
app.use((req, res) => res.status(404).send('Page not found'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
