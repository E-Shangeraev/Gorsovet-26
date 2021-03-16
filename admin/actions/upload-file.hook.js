const AdminBro = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const archiver = require('archiver');
const JSZip = require('jszip');

async function downloadArchive(folderName) {
  // const zip = new JSZip();
  const zipName = 'documents.zip';
  const source = path.join(__dirname, '../../public/uploads/documents/', folderName);
  const out = path.join(__dirname, '../../public/uploads/documents/all', zipName);

  // zip.file(
  //   'robots.txt',
  //   fs.readFileSync(
  //     path.join(__dirname, '../../public/uploads/documents/sessions/2020/robots.txt'),
  //   ),
  // );
  // zip.file(
  //   'test.doc',
  //   fs.readFileSync(path.join(__dirname, '../../public/uploads/documents/sessions/2020/test.doc')),
  // );

  // const data = await zip.generateAsync({
  //   base64: false,
  //   compression: 'DEFLATE',
  //   type: 'nodebuffer',
  // });

  // fs.writeFileSync(out, data, 'binary');

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

    downloadArchive('archives');
  }
  return res;
};

module.exports = { after, before };
