const documentsItem = document.querySelectorAll('.documents__item');
const links = document.querySelectorAll('.documents__item a');

documentsItem.forEach((item) => {
  item.addEventListener('click', (e) => {
    item.classList.toggle('open');
  });
});
