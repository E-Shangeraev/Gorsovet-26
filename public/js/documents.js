const documentsItem = document.querySelectorAll('.documents__item');
const links = document.querySelectorAll('.documents__item a');

documentsItem.forEach((item) => {
  item.addEventListener('click', (e) => {
    item.classList.toggle('open');
  });
});

// links.forEach((item) => {
//   item.addEventListener('click', async (e) => {
//     e.preventDefault();
//     console.log(e.target.dataset.url);
//     const obj = {
//       path: e.target.dataset.url,
//     };

//     await fetch('/documents/download', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded; charset="utf-8"',
//       },
//       body: 'param=' + JSON.stringify(obj),
//     }).then((response) => response.json());
//   });
// });
