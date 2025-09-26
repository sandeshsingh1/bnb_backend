const HomeModel = require("../models/home");
const UserModel = require("../models/user");

// Show all homes (with filters + favourites)
exports.store = (req, res) => {
  let homes = HomeModel.getAll();

  const { location, minPrice, maxPrice, sortBy } = req.query;

  // ✅ filter by location
  if (location) {
    homes = homes.filter(h =>
      h.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // ✅ filter by price
  if (minPrice) {
    homes = homes.filter(h => h.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    homes = homes.filter(h => h.price <= parseInt(maxPrice));
  }

  // ✅ sorting
  if (sortBy === "priceLow") {
    homes.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    homes.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    homes.sort((a, b) => b.rating - a.rating);
  }

  // ✅ mark favourites for current user
  let favIds = [];
  if (req.session.userId) {
    favIds = UserModel.getFavourites(req.session.userId);
  }

  const homesWithFav = homes.map(h => ({
    ...h,
    isFavourite: favIds.includes(h.id)
  }));

  res.render("store/home-list", { homearr: homesWithFav, query: req.query });
};

// Show bookings
exports.bookings = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const bookings = UserModel.getBookings(req.session.userId);
  res.render("store/bookings", { bookings });
};

// Show favourites
exports.favourites = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const favIds = UserModel.getFavourites(req.session.userId);
  const homes = HomeModel.getAll();
  const favourites = homes.filter(h => favIds.includes(h.id));
  res.render("store/favourite-list", { favourites });
};

// Toggle favourite
exports.toggleFavourite = (req, res) => {
  if (!req.session.userId) return res.json({ success: false });

  const homeId = parseInt(req.body.id);
  const favs = UserModel.getFavourites(req.session.userId);

  if (favs.includes(homeId)) {
    UserModel.removeFavourite(req.session.userId, homeId);
  } else {
    UserModel.addFavourite(req.session.userId, homeId);
  }

  res.json({ success: true });
};

// ✅ Home Details
exports.getHomeDetails = (req, res) => {
  const homeId = parseInt(req.params.homeid);
  const home = HomeModel.getById(homeId);

  if (!home) return res.status(404).send("Home not found");

  res.render("store/home-details", { home });
};

// ✅ Add booking (UPGRADED)
exports.addBooking = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const homeId = parseInt(req.params.homeid);
  const home = HomeModel.getById(homeId);
  if (!home) return res.status(404).send("Home not found");

  const { checkin, checkout, guests } = req.body;

  // calculate nights
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const nights = Math.max(
    1,
    Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
  );

  const total = nights * home.price; // 👈 guests multiply karna ho to * guests bhi kar sakte ho

  const booking = {
    id: home.id,
    name: home.name,
    location: home.location,
    price: home.price,
    photo: home.photo,
    checkin,
    checkout,
    guests,
    nights,
    total,
    date: new Date().toLocaleDateString()
  };

  UserModel.addBooking(req.session.userId, booking);
  res.redirect("/bookings");
};

// Cancel booking
exports.cancelBooking = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const homeId = parseInt(req.params.homeid);
  UserModel.removeBooking(req.session.userId, homeId);
  res.redirect("/bookings");
};

// Delete a home
exports.deleteHome = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const homeId = parseInt(req.params.homeid);
  HomeModel.delete(homeId);
  res.redirect("/host/host-home");
};
exports.addReview = (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const homeId = parseInt(req.params.homeid);
  const { rating, comment } = req.body;

  const review = {
    userId: req.session.userId,
    username: req.session.username || "Anonymous",
    rating: parseInt(rating),
    comment,
    date: new Date().toLocaleDateString()
  };

  const HomeModel = require("../models/home");
  HomeModel.addReview(homeId, review);
  res.redirect(`/homes/${homeId}`);
};
