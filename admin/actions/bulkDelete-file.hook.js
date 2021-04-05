const AdminBro = require('admin-bro');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

async function addToArchive(page, folderName) {
  const zipName = `${folderName}.zip`;
  const source = path.join(__dirname, '../../public/uploads', page, folderName);
  const out = path.join(__dirname, '../../public/uploads', page, 'archives', zipName);
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive
    .directory(source, false)
    .on('error', (err) => console.log(err))
    .pipe(stream);

  stream.on('close', () => console.log('closed'));
  archive.finalize();
  console.log('zip file created');
}

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const handler = async (req, res, context, page, directory) => {
  const { records, resource, h, translateMessage } = context;

  if (req.method === 'get') {
    const recordsInJSON = records.map((record) => record.toJSON(context.currentAdmin));
    return {
      records: recordsInJSON,
    };
  }
  if (req.method === 'post') {
    await Promise.all(records.map((record) => resource.delete(record.id())));

    records.forEach((record) => {
      if (record.params.filePath) {
        const filePath = record.params.filePath;
        const localFilePath = path.join(__dirname, '../../public', filePath);
        fs.unlink(localFilePath, () => addToArchive(page, directory));
      }
    });

    return {
      records: records.map((record) => record.toJSON(context.currentAdmin)),
      notice: {
        message: translateMessage('successfullyBulkDeleted', resource.id(), {
          count: records.length,
        }),
        type: 'success',
      },
      redirectUrl: h.resourceUrl({ resourceId: resource._decorated.id() || resource.id() }),
    };
  }
};

module.exports = { handler };
