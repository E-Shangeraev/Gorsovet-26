function clock() {
  const date = new Date();
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  const time = hours + ':' + minutes + ':' + seconds;

  document.querySelector('.event__time').textContent = time;
}
setInterval(clock, 1000);

function currentDate() {
  const d = new Date();
  const month = new Array(
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  );
  const today = d.getDate() + ' ' + month[d.getMonth()] + ' ' + d.getFullYear();

  document.querySelector('.event__date').textContent = today;
}
currentDate();
