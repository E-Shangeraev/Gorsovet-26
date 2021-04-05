const AdminBro = require('admin-bro');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context) => {
  const { record } = context;
  const filePath = record.params.filePath;

  fs.unlinkSync(path.join(__dirname, '../../public', filePath));

  return res;
};

module.exports = { after };
