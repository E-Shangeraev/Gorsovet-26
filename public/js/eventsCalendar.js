// const fileName = document.location.pathname.split('/')[1];
if (fileName === '') {
  let data = [
    {
      date: '2021-01-21 10:15:20',
      title:
        'Заседание рабочей группы по изучению вопроса об организации и проведении капитального ремонта общего имущества в многоквартирных домах города Железногорска',
      description: '',
      url: 'https://webformyself.com/jquery-event-calendar-kalendar-sobytij/',
    },
    {
      date: '2021-01-25 10:15:20',
      title: 'Событие 2',
      description: '',
      url: 'https://webformyself.com/jquery-event-calendar-kalendar-sobytij/',
    },
    {
      date: '2021-02-01 10:15:20',
      title: 'Событие 3',
      description: '',
      url: 'https://webformyself.com/jquery-event-calendar-kalendar-sobytij/',
    },
    {
      date: '2021-01-11 10:15:20',
      title:
        'Заседание постоянной комиссии по градостроительству и дорожно-транспортной инфраструктуре',
      description: '',
      url: 'https://webformyself.com/jquery-event-calendar-kalendar-sobytij/',
    },
  ];

  $('#eventsCalendar').eventCalendar({
    // eventsjson: 'file.json',
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
      dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
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
}
