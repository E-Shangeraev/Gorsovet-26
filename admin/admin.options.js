const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');
const Admin = require('./admin.resourceOptions');
const Activity = require('../models/Activity');
const Calendar = require('../models/Calendar');
const Deputie = require('../models/Deputie');
const News = require('../models/News');

const { before: passwordBeforeHook, after: passwordAfterHook } = require('./actions/password.hook');
const { before: uploadBeforeHook, after: uploadAfterHook } = require('./actions/upload-image.hook');

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
        save: 'Сохранить',
      },
      resources: {
        Activity: {
          properties: {
            title: 'Заголовок',
            text: 'Текст',
            img: 'Путь к изображению',
            uploadImage: 'Изображение',
            date: 'Дата публикации',
            views: 'Кол-во просмотров',
          },
        },
        Calendar: {
          properties: {
            title: 'Заголовок',
            text: 'Текст',
            img: 'Путь к изображению',
            uploadImage: 'Изображение',
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
        listProperties: ['title', 'text', 'date', 'views', 'uploadImage'],
        parent: {
          name: 'Контент сайта',
        },
        properties: {
          uploadImage: {
            components: {
              edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
              list: AdminBro.bundle('./components/upload-image.list.tsx'),
            },
          },
        },
        actions: {
          new: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
          show: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: Calendar,
      options: {
        listProperties: ['title', 'text', 'date', 'url', 'uploadImage'],
        parent: {
          name: 'Контент сайта',
        },
        properties: {
          uploadImage: {
            components: {
              edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
              list: AdminBro.bundle('./components/upload-image.list.tsx'),
            },
          },
        },
        actions: {
          new: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
        },
      },
    },
    {
      resource: Deputie,
      options: {
        listProperties: ['name', 'uploadImage', 'post', 'schedule', 'appointment', 'about'],
        parent: {
          name: 'Контент сайта',
        },
        properties: {
          uploadImage: {
            components: {
              edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
              list: AdminBro.bundle('./components/upload-image.list.tsx'),
            },
          },
        },
        actions: {
          new: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
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
