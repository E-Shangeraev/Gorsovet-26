function sendForm(form, url) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('.form__field[name="name"]');
    const phone = document.querySelector('.form__field[name="phone"]');
    const question = document.querySelector('.form__field[name="question"]');
    const email = document.querySelector('.form__field[name="email"]');
    const file = document.querySelector('.form__field[name="file"]');
    const address = document.querySelector('.form__field[name="address"]');
    const deput = document.querySelector('input[name="deput"]');

    if (name.value == '' || phone.value == '' || question.value == '') {
      //не заполнены поля
      console.log('Поля не заполнены');
    }

    // console.log(name);

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name: name.value.trim(),
        phone: phone.value.trim(),
        question: question.value.trim(),
        email: email.value.trim(),
        file: file.value.trim(),
        address: address.value.trim(),
        deput: deput.value.trim(),
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
        email.value = '';
        file.value = '';
        address.value = '';
        deput.value = '';
      })
      .then((res) => res.text())
      .then((data) => console.log(data));
  });
}

console.log(fileName);

if (fileName === '') {
  const questionForm = document.querySelector('.questions__form');
  sendForm(questionForm, '/question');
}
if (fileName === 'reception') {
  const receptionForm = document.querySelector('.reception__form');
  sendForm(receptionForm, '/reception/appeal');
}
