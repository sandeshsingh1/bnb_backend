const express = require('express');
const storeController = require('../controllers/store');
const userRouter = express.Router();

// Public routes
userRouter.get('/', storeController.store);
userRouter.get('/bookings', storeController.bookings);
userRouter.get('/favourites', storeController.favourites);

// Favourites toggle
userRouter.post('/toggle-favourite', storeController.toggleFavourite);

// Homes
userRouter.get('/homes/:homeid', storeController.getHomeDetails);

// Bookings
userRouter.post('/book/:homeid', storeController.addBooking);
userRouter.post('/cancel-booking/:homeid', storeController.cancelBooking);

// Delete Home (sirf host ke liye relevant hai, but agar yaha chhodna hai to theek hai)
userRouter.post('/delete-home/:homeid', storeController.deleteHome);

// ✅ Add Review Route
userRouter.post('/homes/:homeid/review', storeController.addReview);

module.exports = userRouter;
