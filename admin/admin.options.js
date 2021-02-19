const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const Admin = require('./admin.resourceOptions');
const Activity = require('../models/Activity');
const Calendar = require('../models/Calendar');
const Deputie = require('../models/Deputie');
const News = require('../models/News');

AdminBro.registerAdapter(AdminBroMongoose);

/** @type {import('admin-bro').AdminBroOptions} */
const options = {
  locale: {
    language: 'rus',
    translations: {
      actions: {
        new: 'Добавить',
        edit: 'Редактировать',
        show: 'Подробнее',
        delete: 'Удалить',
      },
      labels: {
        Admin: 'Администраторы',
        Activity: 'Активности',
        Calendar: 'Календарь событий',
        Deputie: 'Депутатский корпус',
        News: 'Новости',
      },
      buttons: {
        filter: 'Фильтр',
      },
      resources: {
        Activity: {
          properties: {
            title: 'Заголовок',
            text: 'Текст',
            img: 'Изображение',
            date: 'Дата публикации',
            views: 'Кол-во просмотров',
          },
        },
        Calendar: {
          properties: {
            title: 'Заголовок',
            url: 'Ссылка',
            date: 'Дата проведения',
          },
        },
        Deputie: {
          properties: {
            name: 'Имя',
            img: 'Фото',
            post: 'Должность',
            schedule: 'График приема',
            appointment: 'Запись на прием',
            about: 'О депутате',
          },
        },
        News: {
          properties: {
            title: 'Заголовок',
            text: 'Текст',
            img: 'Изображение',
            date: 'Дата публикации',
            views: 'Кол-во просмотров',
          },
        },
      },
    },
  },
  resources: [
    Admin,
    {
      resource: Activity,
      options: {
        listProperties: ['title', 'text', 'img', 'date', 'views'],
        parent: {
          name: 'Контент сайта',
        },
        properties: {
          img: {
            components: {
              edit: AdminBro.bundle('./components/image.edit.tsx'),
            },
          },
        },
      },
    },
    {
      resource: Calendar,
      options: {
        listProperties: ['title', 'url', 'date'],
        parent: {
          name: 'Контент сайта',
        },
      },
    },
    {
      resource: Deputie,
      options: {
        listProperties: ['name', 'img', 'post', 'schedule', 'appointment', 'about'],
        parent: {
          name: 'Контент сайта',
        },
      },
    },
    {
      resource: News,
      options: {
        listProperties: ['title', 'text', 'img', 'date', 'views'],
        parent: {
          name: 'Контент сайта',
        },
      },
    },
  ],
  branding: {
    companyName: 'Совет депутатов ЗАТО г. Железногорск',
  },
};

module.exports = options;
