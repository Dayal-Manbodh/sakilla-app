const customerDao = require("../dao/customerDao");

class CustomerService {
  listCustomers(callback) {
    customerDao.getAll(callback);
  }

  getCustomer(id, callback) {
    customerDao.getById(id, callback);
  }

  createCustomer(customer, callback) {
    customerDao.create(customer, callback);
  }

  updateCustomer(id, customer, callback) {
    customerDao.update(id, customer, callback);
  }

  deleteCustomer(id, callback) {
    customerDao.delete(id, callback);
  }
}

module.exports = new CustomerService();
