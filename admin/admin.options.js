const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const Deputie = require('../models/Deputie');

AdminBro.registerAdapter(AdminBroMongoose);

/** @type {AdminBro.AdminBroOptions} */
const options = {
  resources: [Deputie],
};

module.exports = options;
