const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const path = require('path');
const fs = require('fs');
const mv = require('mv');

/** @type {AdminBro.Before} */
const before = async (req, context) => {
  if (req.method === 'post') {
    const { uploadImage, ...other } = req.payload;

    context.uploadImage = uploadImage;

    return {
      ...req,
      payload: other,
    };
  }
  return req;
};

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context) => {
  const { record, uploadImage } = context;

  if (record.isValid() && uploadImage) {
    const filePath = path.join(
      __dirname,
      '../../public/uploads',
      uploadImage.name,
    );

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    // await fs.promises.rename(uploadImage.path, filePath);
    mv(uploadImage.path, filePath, (err) => {
      if (err) throw err;
    });
  }
  return res;
};

module.exports = { after, before };
