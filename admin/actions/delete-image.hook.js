const AdminBro = require('admin-bro');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context, images) => {
  const { record } = context;

  images.forEach((img) => {
    const filePath = record.params[img];
    fs.unlinkSync(path.join(__dirname, '../../public', filePath));
  });

  console.log(record.params);
  return res;
};

module.exports = { after };
