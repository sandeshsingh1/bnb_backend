const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../data/users.json");

// Load users
let users = [];
if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
}

function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Register new user
exports.register = (username, password) => {
  const exists = users.find(u => u.username === username);
  if (exists) return null;

  const user = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    password,   // ⚠️ Plain text for demo only
    favourites: [],
    bookings: []
  };
  users.push(user);
  saveUsers();
  return user;
};

// Login user
exports.login = (username, password) => {
  return users.find(u => u.username === username && u.password === password);
};

// Find user
exports.getById = (id) => {
  return users.find(u => u.id === id);
};

// =======================
// FAVOURITES
// =======================
exports.getFavourites = (userId) => {
  const user = users.find(u => u.id === userId);
  return user ? user.favourites : [];
};

exports.addFavourite = (userId, homeId) => {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    saveUsers();
  }
};

exports.removeFavourite = (userId, homeId) => {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.favourites = user.favourites.filter(id => id !== homeId);
  saveUsers();
};

// =======================
// BOOKINGS
// =======================
exports.getBookings = (userId) => {
  const user = users.find(u => u.id === userId);
  return user ? user.bookings : [];
};

exports.addBooking = (userId, booking) => {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.bookings.push(booking);
  saveUsers();
};

exports.removeBooking = (userId, homeId) => {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.bookings = user.bookings.filter(b => b.id !== homeId);
  saveUsers();
};
