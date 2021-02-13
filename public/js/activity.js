const activityItem = document.querySelectorAll('.activity__item');

activityItem.forEach((item) => {
  item.addEventListener('click', (e) => {
    item.classList.toggle('open');
  });
});
