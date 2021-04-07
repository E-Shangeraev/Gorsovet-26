(function ($) {
  if (document.querySelector('.documents__form')) {
    $.fn.autoSearchDocuments = function (page, category) {
      document.querySelector('.documents__form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('#documents-search');
        const folderDocuments = document.querySelector('.folder__documents');
        const selectedMonth = document.querySelector('.folder__months .selected');
        const activeYear = document.querySelector('.folder__years .active');
        folderDocuments.innerHTML = '';
        folderDocuments.insertAdjacentHTML(
          'afterbegin',
          '<span class="loader loader__news loader--black"></span>',
        );

        if (input.value.length >= 2) {
          let data = {};
          data.action = 'search';
          data.request = input.value;

          $.ajax({
            url: `/${page}/${category}`,
            type: 'POST',
            dataType: 'json',
            data: data,
          }).done(function (data) {
            folderDocuments.innerHTML = '';

            const documents = data.result;
            let html;

            if (documents.length) {
              selectedMonth && selectedMonth.classList.remove('selected');
              activeYear && activeYear.classList.remove('active');

              documents.forEach((doc) => {
                html = `
                    <li>
                      <span class="bage">${doc.category}</span>
                      <a href="${doc.filePath}" download>${doc.name}</a>
                    </li>
                  `;
                folderDocuments.insertAdjacentHTML('beforeend', html);
              });
            } else {
              html = `<p class="preview__text">По вашему запросу ничего не найдено</p>`;
              folderDocuments.insertAdjacentHTML('beforeend', html);
            }
          });
        } else {
          window.location.href = window.location.href;
        }
      });
    };

    $(document).ready(function () {
      if ($('#documents-search')) {
        const category = document.location.pathname.split('/')[2].split('?')[0];
        $('#documents-search').autoSearchDocuments(fileName, category);
      }
    });
  }
})(jQuery);
