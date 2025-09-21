const staffDao = require("../dao/staffDao");
const bcrypt = require("bcrypt");

class StaffService {
  getByUsername(username, callback) {
    staffDao.getByUsername(username, callback);
  }

  verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }

  registerStaff(staffData, callback) {
    const hashedPassword = bcrypt.hashSync(staffData.password, 10);
    staffData.password = hashedPassword;

    // Controleer store_id en address_id
    staffDao.listStores((err, stores) => {
      if (err) return callback(err);
      const storeIds = stores.map((s) => s.store_id);
      if (!storeIds.includes(parseInt(staffData.store_id))) {
        return callback(new Error("Ongeldige store_id"));
      }

      staffDao.listAddresses((err, addresses) => {
        if (err) return callback(err);
        const addressIds = addresses.map((a) => a.address_id);
        if (!addressIds.includes(parseInt(staffData.address_id))) {
          return callback(new Error("Ongeldig address_id"));
        }

        staffDao.createStaff(staffData, callback);
      });
    });
  }

  listStores(callback) {
    staffDao.listStores(callback);
  }

  listAddresses(callback) {
    staffDao.listAddresses(callback);
  }
}

module.exports = new StaffService();
