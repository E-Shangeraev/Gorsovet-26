const close = document.querySelector('.close');
const burger = document.querySelector('.burger');
const headerNav = document.querySelector('.header__nav');

// Открытие меню
burger.addEventListener('click', () => {
  burger.classList.add('burger--animate');
  headerNav.classList.add('open');
  close.classList.add('close--animate');

  setTimeout(() => {
    headerNav.style.backdropFilter = 'brightness(0.4)';
    document.body.style.overflowY = 'hidden';
  }, 950);
});

// Закрытие меню
headerNav.addEventListener('click', (e) => {
  if (!e.target.closest('.header__nav ul') || e.target.closest(close)) {
    headerNav.style.backdropFilter = '';
    document.body.style.overflowY = '';
    setTimeout(() => {
      burger.classList.remove('burger--animate');
      close.classList.remove('close--animate');
      headerNav.classList.remove('open');
    }, 300);
  }
});
