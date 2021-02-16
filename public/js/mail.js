function sendForm(form, url) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('.form__field[name="name"]');
    const phone = document.querySelector('.form__field[name="phone"]');
    const question = document.querySelector('.form__field[name="question"]');
    const email = document.querySelector('.form__field[name="email"]');
    const file = document.querySelector('.form__field[name="file"]');
    const address = document.querySelector('.form__field[name="address"]');
    const deput = document.querySelector('.select span');

    if (file) {
      const formData = new FormData();
      formData.append('file', file.files[0]);

      console.log(file.files);
      console.log(formData);
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name: name.value.trim(),
        phone: phone.value.trim(),
        question: question.value.trim(),
        email: email ? email.value.trim() : '',
        file: file ? formData : null,
        address: address ? address.value.trim() : '',
        deput: deput ? deput.textContent.trim() : '',
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        name.value = '';
        phone.value = '';
        question.value = '';
        email ? (email.value = '') : null;
        file ? (file.files[0] = '') : null;
        address ? (address.value = '') : null;
        deput ? (deput.textContent = 'Выберите депутата, к которому хотите обратиться*') : null;
      })
      .then((data) => console.log(data));
  });
}

if (fileName === '') {
  const questionForm = document.querySelector('.questions__form');
  sendForm(questionForm, '/question');
}
if (fileName === 'reception') {
  const receptionForm = document.querySelector('.reception__form');
  sendForm(receptionForm, '/reception/appeal');
}
