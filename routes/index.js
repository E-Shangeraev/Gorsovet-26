const homeRoutes = require('./main');
const councilRoutes = require('./council');
const activityRoutes = require('./activity');
const corpusRoutes = require('./corpus');
const documentsRoutes = require('./documents');
const contactsRoutes = require('./contacts');
const corruptionRoutes = require('./corruption');
const receptionRoutes = require('./reception');
const newsRoutes = require('./news');
const uploadRoutes = require('./upload');
const buildAdminRouter = require('./admin');

module.exports = {
  homeRoutes,
  councilRoutes,
  activityRoutes,
  corpusRoutes,
  documentsRoutes,
  contactsRoutes,
  corruptionRoutes,
  receptionRoutes,
  newsRoutes,
  uploadRoutes,
  buildAdminRouter,
};
