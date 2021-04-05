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
const after = async (res, req, context, page, directory) => {
  const { record } = context;

  if (record.params.filePath) {
    const filePath = record.params.filePath;
    fs.unlink(path.join(__dirname, '../../public', filePath), () => addToArchive(page, directory));
  }

  return res;
};

module.exports = { after };
