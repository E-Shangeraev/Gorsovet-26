(function ($) {
  if (document.querySelector('.documents__form')) {
    $.fn.autoSearchDocuments = function (page) {
      document.querySelector('.documents__form').addEventListener('submit', (e) => {
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

            if (documents.length) {
              documents.forEach((doc) => {
                html = `
                  <a href="${doc.filePath}" class="documents__result" download>
                    <img src="/img/file-icon.png" alt="${doc.name}"/>
                    <span>${doc.name}</span>
                  </a>
                `;
                documentsContainer.insertAdjacentHTML('beforeend', html);
              });
            } else {
              html = `<p class="preview__text">По вашему запросу ничего не найдено</p>`;
              documentsContainer.insertAdjacentHTML('beforeend', html);
            }
          });
        } else {
          window.location.href = window.location.href;
        }
      });
    };

    $(document).ready(function () {
      if ($('#documents-search')) {
        $('#documents-search').autoSearchDocuments(`/${fileName}`);
      }
    });
  }
})(jQuery);
