const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

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
const after = async (res, req, context, directory) => {
  const { record, uploadFile } = context;

  if (record.isValid() && uploadFile) {
    const fileDir = uploadFile.name.split('.')[0];
    const filePath = path.join(
      __dirname,
      `../../public/uploads/documents/archives`,
      uploadFile.name,
    );
    const pathToExtract = path.join(
      __dirname,
      `../../public/uploads/documents/${directory}/${fileDir}`,
    );

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.rename(uploadFile.path, filePath);

    console.log(uploadFile.path);

    await fs.createReadStream(filePath).pipe(unzipper.Extract({ path: pathToExtract }));
  }
  return res;
};

module.exports = { after, before };
