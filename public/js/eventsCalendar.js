if (fileName === '') {
  fetch('/calendar')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.forEach((d) => {
        d.date = moment(d.date).format('YYYY-MM-DD HH:mm:ss');
        d.url = d.filePath;
        d.description = '';
      });

      console.log(data);

      $('#eventsCalendar').eventCalendar({
        jsonData: data,
        jsonDateFormat: 'human',
        dateFormat: 'DD MMMM',
        locales: {
          locale: 'ru',
          monthNames: [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
          ],
          dayNames: [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
          ],
          dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          txt_noEvents: 'Нет запланированных событий',
          txt_SpecificEvents_prev: '',
          txt_SpecificEvents_after: '',
          txt_next: 'siguiente',
          txt_prev: 'anterior',
          txt_NextEvents: 'Ближайшие события:',
          txt_loading: 'Загрузка данных...',
          moment: {
            months: [
              'Январь',
              'Февраль',
              'Март',
              'Апрель',
              'Май',
              'Июнь',
              'Июль',
              'Август',
              'Сентябрь',
              'Октябрь',
              'Ноябрь',
              'Декабрь',
            ],
            monthsShort: [
              'Янв',
              'Фев',
              'Мар',
              'Апр',
              'Май',
              'Июн',
              'Июл',
              'Авг',
              'Сен',
              'Окт',
              'Ноя',
              'Дек',
            ],
            weekdays: [
              'Воскресенье',
              'Понедельник',
              'Вторник',
              'Среда',
              'Четверг',
              'Пятница',
              'Суббота',
            ],
            weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            week: {
              dow: 1,
              doy: 4,
            },
          },
        },
      });
    });
}
