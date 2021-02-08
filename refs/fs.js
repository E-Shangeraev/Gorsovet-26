const fs = require('fs');
const path = require('path');

// fs.mkdir(path.join(__dirname, 'views'), (err) => {
//   if (err) throw new Error(err);

//   console.log('Папка создана');
// });

// =================================

// fs.writeFile(path.join(__dirname, 'views', 'view.txt'), 'Hello world', (err) => {
//   if (err) throw err;

//   console.log('Файл успешно создан');

//   fs.appendFile(path.join(__dirname, 'views', 'view.txt'), '\nFrom append file', (err) => {
//     if (err) throw err;

//     console.log('Файл изменен');
//   });

//   fs.readFile(path.join(__dirname, 'views', 'view.txt'), 'utf-8', (err, data) => {
//     if (err) throw err;

//     console.log(data);
//   });
// });

// ==================================

// fs.rename(
//   path.join(__dirname, 'views', 'view.txt'),
//   path.join(__dirname, 'views', 'note.txt'),
//   (err) => {
//     if (err) throw err;
//   },
// );
