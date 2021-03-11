// function sendForm(form, url) {
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const name = document.querySelector('.form__field[name="name"]');
//     const phone = document.querySelector('.form__field[name="phone"]');
//     const question = document.querySelector('.form__field[name="question"]');
//     const email = document.querySelector('.form__field[name="email"]');
//     const file = document.querySelector('.form__field[name="file"]');
//     const address = document.querySelector('.form__field[name="address"]');
//     const deput = document.querySelector('.select span');

//     if (file) {
//       const formData = new FormData();
//       formData.append('file', file.files[0]);

//       // console.log(file.files);
//       // console.log(formData);
//     }

//     fetch(url, {
//       method: 'POST',
//       body: JSON.stringify({
//         name: name.value.trim(),
//         phone: phone.value.trim(),
//         question: question.value.trim(),
//         email: email ? email.value.trim() : '',
//         // file: file ? formData : null,
//         address: address ? address.value.trim() : '',
//         deput: deput ? deput.textContent.trim() : '',
//       }),
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(() => {
//         name.value = '';
//         phone.value = '';
//         question.value = '';
//         email ? (email.value = '') : null;
//         // file ? (file.files[0] = '') : null;
//         address ? (address.value = '') : null;
//         deput ? (deput.textContent = 'Выберите депутата, к которому хотите обратиться*') : null;
//       })
//       .then((data) => console.log(data));
//   });
// }

import { Swal } from 'sweetalert2/dist/sweetalert2.js';

console.log(Swal);

function sendForm(form, url) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    if (formData.get('deput')) {
      let response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      let result = await response.json();
      console.log(result);
    }
  });
}

if (fileName === '') {
  const questionForm = document.querySelector('.questions__form');
  sendForm(questionForm, '/question');
}
if (fileName === 'reception') {
  const receptionForm = document.querySelector('.reception__form');
  const dropdownElements = document.querySelector('.reception__dropdown .dropdown-menu');
  const deputName = document.querySelector('input[name="deput"]');

  dropdownElements.addEventListener('click', (e) => {
    if (!e.target.closest('li')) return;
    deputName.value = e.target.textContent.trim();
  });

  sendForm(receptionForm, '/reception/appeal');
}

const fileInput = document.querySelector('.form__field[name="file"]');
const fileLabel = document.querySelector('.reception__form label span');

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  fileLabel.innerHTML = '';
  fileLabel.textContent = 'При необходимости прикрепите файл';

  files.forEach((file) => {
    if (file.type.match('image')) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (ev) => {
      // console.log(ev.target);

      fileLabel.insertAdjacentHTML(
        'beforeend',
        `<img src="/img/file-icon.png" style="width: 50px" />`,
      );
      fileLabel.insertAdjacentHTML('beforeend', `<span>${file.name}</span>`);
      // console.log(fileLabel);
    };

    reader.readAsDataURL(file);
  });
  // console.log(files);
});
