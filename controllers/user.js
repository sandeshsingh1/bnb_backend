const UserModel = require("../models/user");

// Signup page
exports.showSignup = (req, res) => {
  res.render("auth/signup", { error: null }); // always pass error
};

exports.signup = (req, res) => {
  const { username, password } = req.body;
  const user = UserModel.register(username, password);

  if (!user) {
    // show error message instead of raw res.send
    return res.render("auth/signup", { error: "⚠️ User already exists!" });
  }

  req.session.userId = user.id;
  res.redirect("/");
};

// Login page
exports.showLogin = (req, res) => {
  res.render("auth/login", { error: null }); // always pass error
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = UserModel.login(username, password);

  if (!user) {
    return res.render("auth/login", { error: "❌ Invalid username or password!" });
  }

  req.session.userId = user.id;
  res.redirect("/");
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
