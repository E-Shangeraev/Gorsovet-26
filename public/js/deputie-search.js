(function ($) {
  // const string = 'ул. Восточная, 32';
  // const reg = /восточная/gi;
  // console.log(string.match(reg));

  // const ar = ['курчатова', '64'];
  // console.log(ar[1].match(/\d/g).join(''));

  $.fn.autoSearch = function () {
    var request = '';
    var input = this;
    var inputId = document.querySelector('.form__id');

    input.wrap('<div class="searchHolder"></div>');
    input.parent().append('<div class="autoFillBar"></div>');
    var autoFillBar = input.next();

    input.on('focus', function () {
      searchCheck();
    });

    document.querySelector('.form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // input.on('input', function (e) {
    //   const autoFillfBar = document.querySelector('.autoFillBar');
    //   const searchMask = input.val();
    //   const elements = autoFillfBar.querySelectorAll('.item');

    //   const regEx = new RegExp(/.+[0-9]/, 'ig');

    //   if (elements) {
    //     elements.forEach((el) => {
    //       // if (!el.classList.contains('matched')) {
    //       //   autoFillBar.remove(el);
    //       // }
    //       if (el.textContent.match(regEx)) {
    //         el.classList.add('matched');
    //         console.log(el);
    //         // autoFillfBar.insertAdjacentHTML('afterBegin', el);
    //       } else {
    //         el.classList.remove('matched');
    //       }
    //     });

    //   }

    //   console.log(autoFillfBar);
    //   console.log(regEx);
    // });

    input.on('keyup', function (e) {
      if (e.keyCode == 40) {
        if (autoFillBar.find('.active').length == 0) {
          autoFillBar.find('.item:first').addClass('active');
        } else {
          autoFillBar.find('.active').removeClass('active').next().addClass('active');
        }

        var val = autoFillBar.find('.active').text();
        var id = autoFillBar.find('.active').attr('id');
        input.val(val);
        inputId.value = id;
      } else if (e.keyCode == 38) {
        if (autoFillBar.find('.active').length == 0) {
          autoFillBar.find('.item:last').addClass('active');
        } else {
          autoFillBar.find('.active').removeClass('active').prev().addClass('active');
        }

        var val = autoFillBar.find('.active').text();
        var id = autoFillBar.find('.active').attr('id');
        console.log(id);
        inputId.value = id;
        console.log(inputId.value);
      } else if (e.keyCode == 13) {
        // var searchMask = input.val();
        // var regEx = new RegExp(searchMask, 'ig');
        showDeputie();
        //тут можно сделать переход на страницу статьи или все что пожелаешь
      } else {
        searchCheck();
        // const autoFillfBar = document.querySelector('.autoFillBar');
        // const searchMask = input.val();
        // const elements = document.querySelectorAll('.autoFillBar .item');
        // const regEx = new RegExp(/.+[0-9]/, 'ig');

        // if (autoFillfBar.children) {
        //   elements.forEach((el) => {
        //     // console.log(autoFillfBar);
        //     if (!el.textContent.match(regEx)) {
        //       // console.log(el);
        //       el.style.display = 'none';
        //       // autoFillfBar.insertAdjacentHTML('afterbegin', el);
        //     } else {
        //       // console.log(el);
        //       el.style.display = 'block';
        //     }
        //   });
        // }

        // console.log(elements);
      }
    });

    autoFillBar.on('click', '.item', function () {
      //тут можно сделать переход на страницу статьи или все что пожелаешь
      input.val($(this).text());
      inputId.value = $(this).attr('id');
      console.log(inputId.value);
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

    function relevantData() {
      let val = document.querySelector('#deputie-search').value;
      let elements = document.querySelectorAll('.autoFillBar .item');
      let searchMask = val;
      let regEx;

      if (searchMask.indexOf('ул. ') != -1) {
        searchMask = searchMask.replace(/ул[, .-]+/gi, '');
      }

      if (searchMask.indexOf(' ') != -1) {
        console.log(searchMask);
        searchMask = searchMask.split(/[, .-]+/gi);
        regEx = new RegExp('[а-я, .-]+' + searchMask[0] + '[, .-]+' + searchMask[1], 'ig');
      } else {
        console.log(searchMask);
        regEx = new RegExp('[а-я, .-]+' + searchMask + '[, .-]+', 'ig');
      }
      // console.log(searchMask);
      console.log(regEx);

      if (elements.length) {
        // console.log(elements[0].innerText.match(regEx));

        elements.forEach((el) => {
          if (!el.textContent.match(regEx)) {
            el.remove();
          }
        });
      }
    }

    function searchCheck() {
      if (input.val().length >= 2) {
        var data = {};
        data.action = 'search';
        data.request = input.val();

        $.ajax({
          url: '/corpus',
          type: 'POST',
          dataType: 'json',
          data: data,
        }).done(function (data) {
          autoFillBar.children().remove();

          // console.log(data);

          var articlesArray = data.result;

          articlesArray.forEach((item, index) => {
            let addresses = item.address.sort();
            let id = item._id;

            // console.log(addresses);

            for (var i = 0; i <= addresses.length - 1; i++) {
              var address = addresses[i];

              var regex = input.val();

              if (regex.indexOf(' ') == -1) {
                var searchMask = regex;
                var regEx = new RegExp(searchMask, 'ig');
                var num = address.toLowerCase().indexOf(regex.toLowerCase());
                var straddress = address.substr(num, regex.length);
                var replaceMask = '<b class="highlighted">' + straddress + '</b>';
                address = address.replace(regEx, replaceMask);
              } else {
                var regexArr = regex.split(' ');

                for (var n = 0; n < regexArr.length; n++) {
                  if (regexArr[n].length > 0) {
                    var searchMask = regexArr[n];
                    var regEx = new RegExp(searchMask, 'ig');
                    var num = address.toLowerCase().indexOf(regexArr[n].toLowerCase());
                    var straddress = address.substr(num, regexArr[n].length);
                    // console.log(straddress);
                    var replaceMask = '<b class="highlighted">' + straddress + '</b>';
                    var stopWords = '<b class="highlighted"></b>';
                    // console.log(stopWords);
                    if (stopWords.indexOf(straddress.toLowerCase()) == -1) {
                      address = address.replace(regEx, replaceMask);
                    }
                  }
                }
              }

              autoFillBar.append(`<div class="item" id="${id}"><span>${address}</span></div>`);
            }
          });

          relevantData();

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
        // removeDeputie();
        const find = document.querySelector('.find');

        autoFillBar.children().remove();

        let data = {};
        data.action = 'search';
        // data.request = input.val().split('. ')[1];
        data.request = inputId.value;

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

          console.log(deput);
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
