const HomeModel = require("../models/home");
const UserModel = require("../models/user");

// ======================
// Host Dashboard with Stats
// ======================
exports.hostDashboard = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const homes = HomeModel.getAll();

  // Sirf us host ke homes
  const myHomes = homes.filter(h => h.hostId === req.session.userId);

  // Stats calculate karo
  let totalBookings = 0;
  let totalFavourites = 0;
  let totalEarnings = 0;

  const allUsers = require("../data/users.json"); // directly load users data

  myHomes.forEach(home => {
    allUsers.forEach(user => {
      // ✅ Safe check for bookings
      (user.bookings || []).forEach(b => {
        if (b.id === home.id) {
          totalBookings++;
          totalEarnings += b.price; // simple earnings estimate
        }
      });

      // ✅ Safe check for favourites
      if ((user.favourites || []).includes(home.id)) {
        totalFavourites++;
      }
    });
  });

  res.render("host/host-home", {
    homes: myHomes,
    stats: {
      totalBookings,
      totalFavourites,
      totalEarnings
    }
  });
};

// ======================
// Add Home
// ======================
exports.addHome = (req, res) => {
  res.render("host/add-home");
};

exports.createHome = (req, res) => {
  const { name, location, price, rating, description } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  HomeModel.add({
    name,
    location,
    price: parseInt(price),
    rating: parseInt(rating),
    description,
    photo,
    hostId: req.session.userId,  // ✅ hostId save
    reviews: []                  // ✅ empty reviews by default
  });

  res.render("host/homeAdded", { homeName: name });
};


// ======================
// Edit Home
// ======================
exports.getEditHome = (req, res) => {
  const homeId = parseInt(req.params.homeid);
  const home = HomeModel.getById(homeId);
  if (!home) return res.status(404).send("Home not found");
  res.render("host/edit-home", { home });
};

exports.updateHome = (req, res) => {
  const homeId = parseInt(req.params.homeid);
  const { name, location, price, rating, description } = req.body;
  const photo = req.file ? "/uploads/" + req.file.filename : null;

  HomeModel.update(homeId, {
    name,
    location,
    price: parseInt(price),
    rating: parseFloat(rating) || 0,
    description,
    photo,
    hostId: req.session.userId // ✅ ensure hostId remains
  });

  res.redirect("/host/host-home");
};

// ======================
// Delete Home
// ======================
exports.deleteHome = (req, res) => {
  const homeId = parseInt(req.params.homeid);
  HomeModel.delete(homeId);
  res.redirect("/host/host-home");
};
exports.updateHome = (req, res) => {
  const homeId = parseInt(req.params.homeid);
  const { name, location, price, rating, description } = req.body;
  const existingHome = HomeModel.getById(homeId);

  if (!existingHome) return res.status(404).send("Home not found");

  const photo = req.file ? "/uploads/" + req.file.filename : existingHome.photo; // ✅ purana photo agar naya upload nahi hua

  HomeModel.update(homeId, {
    name,
    location,
    price: parseInt(price),
    rating: parseFloat(rating) || 0,
    description,
    photo,
    hostId: req.session.userId // ✅ ensure hostId not lost
  });

  res.redirect("/host/host-home");
};
