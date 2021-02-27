(function ($) {
  $.fn.autoSearch = function () {
    var request = '';
    var input = this;

    input.wrap('<div class="searchHolder"></div>');
    input.parent().append('<div class="autoFillBar"></div>');
    var autoFillBar = input.next();

    input.on('focus', function () {
      searchCheck();
    });

    document.querySelector('.form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    input.on('keyup', function (e) {
      if (e.keyCode == 40) {
        if (autoFillBar.find('.active').length == 0) {
          autoFillBar.find('.item:first').addClass('active');
        } else {
          autoFillBar.find('.active').removeClass('active').next().addClass('active');
        }

        var val = autoFillBar.find('.active').text();
        input.val(val);
      } else if (e.keyCode == 38) {
        if (autoFillBar.find('.active').length == 0) {
          autoFillBar.find('.item:last').addClass('active');
        } else {
          autoFillBar.find('.active').removeClass('active').prev().addClass('active');
        }

        var val = autoFillBar.find('.active').text();
        input.val(val);
      } else if (e.keyCode == 13) {
        showDeputie();
        //тут можно сделать переход на страницу статьи или все что пожелаешь
      } else {
        searchCheck();
      }
    });

    autoFillBar.on('click', '.item', function () {
      //тут можно сделать переход на страницу статьи или все что пожелаешь
      input.val($(this).text());
      showDeputie();
      return false;
    });

    autoFillBar.on('click', '.item', function (e) {
      if (
        !$(e.target).hasClass('autoFillBar') &&
        !$(e.target).parent().hasClass('autoFillBar') &&
        !$(e.target).parent().hasClass('searchHolder')
      ) {
        autoFillBar.slideUp('fast', function () {
          autoFillBar.children().remove();
        });
      }
    });

    $('html').on('click', function (e) {
      if (
        !$(e.target).hasClass('autoFillBar') &&
        !$(e.target).parent().hasClass('autoFillBar') &&
        !$(e.target).parent().hasClass('searchHolder')
      ) {
        autoFillBar.slideUp('fast', function () {
          autoFillBar.children().remove();
        });
      }
    });

    function searchCheck() {
      if (input.val().length >= 2) {
        // тут нужно будет описать ajax-запрос к бэкэнду, который вернет результаты поиска

        var data = {};
        data.action = 'search';
        data.request = input.val();

        // ajax-запрос на сервер, откомментируй, когда будет куда отсылать POST

        $.ajax({
          url: '/corpus',
          type: 'POST',
          dataType: 'json',
          data: data,
        }).done(function (data) {
          autoFillBar.children().remove();

          // console.log(data);
          // следующая строчка читает результат ajax-запроса, откомментируй ее, когда будет готов бэкэнд
          var articlesArray = data.result;

          // Здесь я описываю фейковый поиск, чтобы продемонстрировать работу плагина
          // строки 241 - 262 можно выпилить несчадно
          // поиск ведется только по одному слову, но твоя база точно может лучше ;)

          // Здесь фейк заканчивается и начинаются чудеса

          for (var i = 0; i <= articlesArray.length - 1; i++) {
            var name = articlesArray[i].name;
            var regex = input.val();

            if (regex.indexOf(' ') == -1) {
              var searchMask = regex;
              var regEx = new RegExp(searchMask, 'ig');

              var num = name.toLowerCase().indexOf(regex.toLowerCase());
              var strname = name.substr(num, regex.length);
              var replaceMask = '<b class="highlighted">' + strname + '</b>';
              name = name.replace(regEx, replaceMask);
            } else {
              var regexArr = regex.split(' ');

              for (var n = 0; n < regexArr.length; n++) {
                if (regexArr[n].length > 0) {
                  var searchMask = regexArr[n];
                  var regEx = new RegExp(searchMask, 'ig');

                  var num = name.toLowerCase().indexOf(regexArr[n].toLowerCase());
                  var strname = name.substr(num, regexArr[n].length);
                  var replaceMask = '<b class="highlighted">' + strname + '</b>';
                  var stopWords = '<b class="highlighted"></b>';
                  if (stopWords.indexOf(strname.toLowerCase()) == -1) {
                    name = name.replace(regEx, replaceMask);
                  }
                }
              }
            }

            autoFillBar.append('<div class="item">' + '<span>' + name + '</span>' + '</div>');
          }

          autoFillBar.slideDown('fast');

          // конец ajax-запроса, ты знаешь, что делать ;)
        });
      }
    }

    function removeDeputie() {
      const yourDeputie = document.querySelectorAll('.find .your-deputie');
      yourDeputie.forEach((item) => (item.innerHTML = ''));
    }

    function showDeputie() {
      document.querySelector('.form').addEventListener('submit', (e) => {
        e.preventDefault();
        removeDeputie();
        const find = document.querySelector('.find');

        autoFillBar.children().remove();

        let data = {};
        data.action = 'search';
        data.request = input.val();

        $.ajax({
          url: '/corpus/search',
          type: 'POST',
          dataType: 'json',
          data: data,
        }).done(function (data) {
          console.log(data);
          const deput = data.result[0];
          const about = deput.about ? deput.about : '';
          const schedule = deput.schedule
            ? `
          <p>
            <span class="red">
              График приема:
            </span>
            ${deput.schedule}
          </p>`
            : '';
          const appointment = deput.appointment
            ? `
          <p>
            <span class="red">
              Запись:
            </span>
            ${deput.appointment}
          </p>`
            : '';

          const res = `
          <div class="your-deputie">
            <h2 class="subtitle">
              Ваш депутат
            </h2>
            <div class="your-deputie__wrapper bg-gray bg-gray--border">
              <img class="your-deputie__photo" src="${deput.img}" />
              <header class="your-deputie__header d-flex">
                <div>
                  <h3 class="your-deputie__name">
                    ${deput.name}
                  </h3>
                  <p class="your-deputie__post">
                    ${deput.post}
                  </p>
                </div>
                <img src="${deput.fraction}" />
              </header>
              <p class="your-deputie__desc">
                ${about}
              </p>
              <footer class="your-deputie__footer">
                ${schedule}
                ${appointment}
              </footer>
            </div>
          </div>
          `;
          removeDeputie();
          find.insertAdjacentHTML('beforeend', res);
        });
      });
    }

    return input;
  };

  $(document).ready(function () {
    $('#deputie-search').autoSearch();
  });
})(jQuery);
