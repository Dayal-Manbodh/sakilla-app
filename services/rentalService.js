const rentalDao = require("../dao/rentalDao");

class RentalService {
  listRentals(callback) {
    rentalDao.getAllRentals(callback);
  }

  createRental(filmId, customerId, callback) {
    rentalDao.getAvailableInventory(filmId, (err, inventoryId) => {
      if (err) return callback(err);
      rentalDao.createRental(inventoryId, customerId, callback);
    });
  }

  closeRental(rentalId, callback) {
    rentalDao.closeRental(rentalId, callback);
  }
}

module.exports = new RentalService();
