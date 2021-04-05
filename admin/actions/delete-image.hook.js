const AdminBro = require('admin-bro');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context, images) => {
  const { record } = context;

  images.forEach((img) => {
    console.log(record.params[img]);

    if (record.params[img]) {
      const filePath = record.params[img];
      const localFilePath = path.join(__dirname, '../../public', filePath);
      if (filePath !== '') {
        fs.unlinkSync(localFilePath);
      }
    }
  });

  console.log(record.params);
  return res;
};

module.exports = { after };
