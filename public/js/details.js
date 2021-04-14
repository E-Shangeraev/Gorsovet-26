if (fileName === 'council') {
  const collapsible = document.querySelectorAll('.collapsible');

  collapsible.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.details')) return;

      const btn = item.querySelector('.details');
      btn.classList.toggle('open');

      const content = item.querySelector('.details__content');
      content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';

      item.classList.toggle('collapsible--opened');
    });
  });
}
