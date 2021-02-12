const documentsItem = document.querySelectorAll('.documents__item');

documentsItem.forEach((item) => {
  item.addEventListener('click', (e) => {
    item.classList.toggle('open');
  });
});
