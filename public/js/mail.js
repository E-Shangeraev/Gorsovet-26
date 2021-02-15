if (fileName === '') {
  const questionForm = document.querySelector('.questions__form');

  questionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('.questions__form .form__field[name="name"]').value.trim();
    const phone = document
      .querySelector('.questions__form .form__field[name="phone"]')
      .value.trim();
    const question = document
      .querySelector('.questions__form .form__field[name="question"]')
      .value.trim();

    if (name == '' || phone == '' || question == '') {
      //не заполнены поля
      console.log('Поля не заполнены');
    }

    console.log(name);

    fetch('/question', {
      method: 'POST',
      body: JSON.stringify({
        name,
        phone,
        question,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.text())
      .then((data) => console.log(data));
  });
}
