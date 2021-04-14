const subscribe = document.querySelector('.subscribe');

subscribe &&
  subscribe.addEventListener('submit', async function (e) {
    e.preventDefault();

    const subscribeName = document.querySelector('.subscribe__field[type="name"]').value;
    const subscribeEmail = document.querySelector('.subscribe__field[type="email"]').value;

    const obj = {
      name: subscribeName,
      email: subscribeEmail,
    };

    const url = '/news/subscribe';

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset="utf-8"',
      },
      body: 'request=' + JSON.stringify(obj),
    }).then((response) => {
      if (response.status === 200) {
        Swal.fire({
          title: 'Оформление подписки!',
          text: 'Вам на почту было выслано письмо для подтверждения подписки',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.reset();
      } else if (response.status === 403) {
        Swal.fire({
          title: 'Пользователь с таким email уже существует',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Что-то пошло не так...',
          text: 'Проверьте корректность введенных данных',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    });
  });
