const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.Before} */
const before = async (req, context) => {
  if (req.method === 'post') {
    const { uploadImage, ...other } = req.payload;

    context.uploadImage = uploadImage;

    console.log(uploadImage);

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
    console.log('record', record);

    const filePath = path.join(__dirname, '../../public/uploads', uploadImage.name);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.rename(uploadImage.path, filePath);

    // await record.update({ img: `/${filePath}` });
  }
  return res;
};

module.exports = { after, before };
