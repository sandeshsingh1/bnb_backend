const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const homesFile = path.join(dataDir, 'homes.json');

// ---------------- HOMES ----------------
let homes = [];

// Load saved homes if file exists
if (fs.existsSync(homesFile)) {
  homes = JSON.parse(fs.readFileSync(homesFile, 'utf-8'));
} else {
  homes = [];
  fs.writeFileSync(homesFile, JSON.stringify(homes, null, 2));
}

// Save homes to file
function saveHomes() {
  fs.writeFileSync(homesFile, JSON.stringify(homes, null, 2));
}

// ---------------- EXPORTS ----------------
exports.getAll = () => homes;

exports.getById = (id) => homes.find(h => h.id === parseInt(id));

exports.add = (home) => {
  home.id = Date.now(); // unique id
  homes.push({
    ...home,
    hostId: home.hostId || null   // ✅ ensure hostId is always stored
  });
  saveHomes();
};

exports.update = (id, updatedHome) => {
  const index = homes.findIndex(h => h.id === id);
  if (index !== -1) {
    homes[index] = {
      ...homes[index],
      ...updatedHome
    };
    saveHomes();
  }
};

exports.delete = (id) => {
  id = parseInt(id);
  homes = homes.filter(h => h.id !== id);
  saveHomes();
};
exports.update = (id, updatedHome) => {
  id = parseInt(id);
  const index = homes.findIndex(h => h.id === id);
  if (index !== -1) {
    homes[index] = { ...homes[index], ...updatedHome, id }; // ✅ merge with existing
    saveHomes();
  }
};
exports.addReview = (homeId, review) => {
  homeId = parseInt(homeId);
  const home = homes.find(h => h.id === homeId);
  if (home) {
    if (!home.reviews) {
      home.reviews = [];
    }
    home.reviews.push(review);
    saveHomes();
    return true;
  }
  return false;
};
