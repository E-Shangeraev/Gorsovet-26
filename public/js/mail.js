document.addEventListener('DOMContentLoaded', () => {
  function sendForm(form, url) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let formData = new FormData(form);

      await fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data == '1') {
            Swal.fire({
              title: 'Спасибо за обращение!',
              text: 'С Вами свяжутся в ближайшее время',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            form.reset();
          } else {
            Swal.fire({
              title: 'Письмо не отправлено',
              text: 'Укажите депутата, к которому вы хотели бы обратиться',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        });
    });
  }

  const questionForm = document.querySelector('.questions__form');
  const receptionForm = document.querySelector('.reception__form');

  if (questionForm) {
    sendForm(questionForm, '/question');
  }

  if (receptionForm) {
    const dropdownElements = document.querySelector('.reception__dropdown .dropdown-menu');
    const deputName = document.querySelector('input[name="deput"]');
    const fileInput = document.querySelector('.form__field[name="file"]');
    const fileLabel = document.querySelector('.reception__form label span');

    dropdownElements.addEventListener('click', (e) => {
      if (!e.target.closest('li')) return;
      deputName.value = e.target.textContent.trim();
    });

    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      fileLabel.innerHTML = '';

      files.forEach((file) => {
        if (file.type.match('image')) {
          return;
        }

        const reader = new FileReader();

        reader.onload = (ev) => {
          fileLabel.insertAdjacentHTML(
            'beforeend',
            `<img src="/img/file-icon.png" style="width: 50px" />`,
          );
          fileLabel.insertAdjacentHTML('beforeend', `<span>${file.name}</span>`);
        };

        reader.readAsDataURL(file);
      });
    });

    sendForm(receptionForm, '/reception/appeal');
  }
});
