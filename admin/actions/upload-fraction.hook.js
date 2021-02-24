const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.Before} */
const before = async (req, context) => {
  if (req.method === 'post') {
    const { uploadFraction, ...other } = req.payload;

    context.uploadFraction = uploadFraction;

    return {
      ...req,
      payload: other,
    };
  }
  return req;
};

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context) => {
  const { record, uploadFraction } = context;

  if (record.isValid() && uploadFraction) {
    const filePath = path.join(__dirname, '../../public/uploads', uploadFraction.name);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.rename(uploadFraction.path, filePath);

    // await record.update({ img: `/${filePath}` });
  }
  return res;
};

module.exports = { after, before };
