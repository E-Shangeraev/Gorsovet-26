const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')
const path = require('path')
const fs = require('fs')
const mv = require('mv')
const archiver = require('archiver')

async function addToArchive(page, folderName) {
  const zipName = `${folderName}.zip`
  const source = path.join(__dirname, '../../public/uploads', page, folderName)
  const out = path.join(
    __dirname,
    '../../public/uploads',
    page,
    'archives',
    zipName,
  )
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(out)

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.log(err)
    } else {
      throw err
    }
  })

  archive.on('error', function (err) {
    throw err
  })

  archive
    .directory(source, false)
    .on('error', err => console.log(err))
    .pipe(stream)

  stream.on('close', () => console.log('closed'))
  archive.finalize()
  console.log('zip file created')
}

/** @type {AdminBro.Before} */
const before = async (req, context) => {
  if (req.method === 'post') {
    const { uploadFile, ...other } = req.payload

    context.uploadFile = uploadFile

    return {
      ...req,
      payload: other,
    }
  }
  return req
}

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const after = async (res, req, context, page, directory) => {
  const { record, uploadFile } = context

  if (record.isValid() && uploadFile) {
    const filePath = path.join(
      __dirname,
      `../../public/uploads/${page}/${directory}`,
      uploadFile.name,
    )

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true })

    // fs.rename(uploadFile.path, filePath, (err) => {
    //   if (err) {
    //     console.log(err);
    //     throw err;
    //   }
    // });

    mv(uploadFile.path, filePath, err => {
      if (err) throw err
    })

    addToArchive(page, directory)
  }
  return res
}

module.exports = { after, before }
