(function ($) {
  $.fn.autoSearch = function (page) {
    document.querySelector('.form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.querySelector('#documents-search');
      const documentsContainer = document.querySelector('.documents__container');
      documentsContainer.innerHTML = '';
      documentsContainer.insertAdjacentHTML(
        'afterbegin',
        '<span class="loader loader__news loader--black"></span>',
      );

      if (input.value.length >= 2) {
        var data = {};
        data.action = 'search';
        data.request = input.value;

        $.ajax({
          url: `${page}`,
          type: 'POST',
          dataType: 'json',
          data: data,
        }).done(function (data) {
          console.log(data);

          documentsContainer.innerHTML = '';

          const documents = data.result;
          let html;

          // if (documents.length) {
          //   news.forEach((doc) => {

          //     newsContainer.insertAdjacentHTML('beforeend', html);
          //   });
          // } else {
          //   html = `<p class="preview__text">По вашему запросу ничего не найдено</p>`;
          //   newsContainer.insertAdjacentHTML('beforeend', html);
          // }
        });
      } else {
        window.location.href = window.location.href;
      }
    });
  };

  $(document).ready(function () {
    $('#documents-search').autoSearch(`/${fileName}`);
  });
})(jQuery);
