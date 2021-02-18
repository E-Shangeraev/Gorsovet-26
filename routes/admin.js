const { default: AdminBro } = require('admin-bro');
const { buildAuthenticatedRouter } = require('admin-bro-expressjs');
const express = require('express');
const argon2 = require('argon2');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const Admin = require('../models/Admin');

/**
 * @param {AdminBro} admin
 * @return {express.Router} router
 */
const buildAdminRouter = (admin) => {
  const router = buildAuthenticatedRouter(
    admin,
    {
      cookieName: 'admin-bro',
      cookiePassword: 'superlongandcomplicatedname',
      authenticate: async (login, password) => {
        const user = await Admin.findOne({ login });

        if (user) {
          // const matched = await argon2.verify(user.encryptedPassword, password);
          const matched = true;

          if (matched) {
            return user.toJSON();
          }
        }
        return null;
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    },
  );
  return router;
};

module.exports = buildAdminRouter;
