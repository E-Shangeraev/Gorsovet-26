(function ($) {
  const newsForm = document.querySelector('.news__form');
  if (newsForm) {
    $.fn.autoSearch = function (page) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('#news-search');
        const newsContainer = document.querySelector('.news__container');
        const newsFooter = document.querySelector('.news__footer');
        newsContainer.innerHTML = '';
        newsContainer.insertAdjacentHTML(
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
            newsContainer.innerHTML = '';

            if (newsFooter) {
              newsFooter.remove();
            }

            const news = data.result;
            let html;

            if (news.length) {
              news.forEach((n) => {
                html = `
                <a href="/news/${n._id}">
                  <figure class="preview">
                    <img class="preview__image" src="${n.img}" alt="${n.title}" />
                    <figcaption class="preview__caption">
                      <h4 class="preview__title">
                        ${n.title}
                      </h4>
                      <p class="preview__text">
                       ${n.text.substr(0, 199)}...
                      </p>
                      <div class="preview__footer">
                        <time pubdate>
                          ${moment(n.date).format('DD.MM.YYYY')}
                        </time>
                        <p class="preview__views">
                          <img src="svg/views.svg" />
                          <span class="preview__count">
                            ${n.views}
                          </span>
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </a>
                `;
                newsContainer.insertAdjacentHTML('beforeend', html);
              });
            } else {
              html = `<p class="preview__text">По вашему запросу ничего не найдено</p>`;
              newsContainer.insertAdjacentHTML('beforeend', html);
            }
          });
        } else {
          window.location.href = window.location.href;
        }
      });
    };

    $(document).ready(function () {
      $('#news-search').autoSearch(`/${fileName}`);
    });
  }
})(jQuery);
