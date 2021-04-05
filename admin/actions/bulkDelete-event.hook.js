const AdminBro = require('admin-bro');
const path = require('path');
const fs = require('fs');

/** @type {AdminBro.After<AdminBro.ActionResponse>}*/
const handler = async (req, res, context) => {
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
        fs.unlinkSync(localFilePath);
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
