const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.Before} */
const before = async (req, context) => {
  if (req.method === 'post') {
    const { uploadFile, ...other } = req.payload;

    context.uploadFile = uploadFile;

    return {
      ...req,
      payload: other,
    };
  }
  return req;
};

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context) => {
  const { record, uploadFile } = context;

  if (record.isValid() && uploadFile) {
    const filePath = path.join(__dirname, '../../public/uploads/documents', uploadFile.name);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.rename(uploadFile.path, filePath);
  }
  return res;
};

module.exports = { after, before };
