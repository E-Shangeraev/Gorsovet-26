if (fileName === 'council') {
  const structureData = document.querySelectorAll('.structure__data');
  const commissionBlock = document.querySelectorAll('.commission__block');

  structureData.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.structure__details')) return;

      item.classList.toggle('open');
    });
  });

  commissionBlock.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.commission__details')) return;

      item.classList.toggle('open');
    });
  });
}
