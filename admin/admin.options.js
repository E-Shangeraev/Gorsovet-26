const { default: AdminBro } = require('admin-bro');
const uploadFeature = require('@admin-bro/upload');
const AdminBroMongoose = require('admin-bro-mongoose');
const Admin = require('./admin.resourceOptions');
const Activity = require('../models/Activity');
const Calendar = require('../models/Calendar');
const Deputie = require('../models/Deputie');
const News = require('../models/News');
const Report = require('../models/Report');
const DocumentSession = require('../models/DocumentSession');
const DocumentReport = require('../models/DocumentReport');
const DocumentBase = require('../models/DocumentBase');

const { before: passwordBeforeHook, after: passwordAfterHook } = require('./actions/password.hook');
const { before: uploadBeforeHook, after: uploadAfterHook } = require('./actions/upload-image.hook');
const {
  before: uploadBeforeFractionHook,
  after: uploadAfterFractionHook,
} = require('./actions/upload-fraction.hook');
const {
  before: uploadBeforeFileHook,
  after: uploadAfterFileHook,
} = require('./actions/upload-file.hook');

AdminBro.registerAdapter(AdminBroMongoose);

const getDocumentOptions = (model, category) => ({
  resource: model,
  options: {
    listProperties: ['title'],
    editProperties: ['uploadFile', 'title'],
    parent: {
      name: 'Документы',
    },
    properties: {
      uploadFile: {
        components: {
          edit: AdminBro.bundle('./components/upload-file.edit.tsx'),
        },
      },
    },
    actions: {
      new: {
        before: async (req, context) => {
          const modifiedRequest = await passwordBeforeHook(req, context);
          uploadBeforeFileHook(modifiedRequest, context);
          return uploadBeforeHook(modifiedRequest, context);
        },
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context);
          uploadAfterFileHook(modifiedResponse, req, context, category);
          return uploadAfterHook(modifiedResponse, req, context);
        },
      },
      edit: {
        before: async (req, context) => {
          const modifiedRequest = await passwordBeforeHook(req, context);
          uploadBeforeFileHook(modifiedRequest, context);
          return uploadBeforeHook(modifiedRequest, context);
        },
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context);
          uploadAfterFileHook(modifiedResponse, req, context, category);
          return uploadAfterHook(modifiedResponse, req, context);
        },
      },
    },
  },
});

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
        Report: 'Фотоотчет',
        DocumentSession: 'Решения сессии',
        DocumentReport: 'Отчёты о деятельности',
        DocumentBase: 'Нормативная правовая база',
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
            uploadImage: 'Фото',
            img: 'Путь к фотографии',
            post: 'Должность',
            schedule: 'График приема',
            appointment: 'Запись на прием',
            about: 'О депутате',
            uploadFraction: 'Партия',
            fraction: 'Путь к картинке партии',
          },
        },
        News: {
          properties: {
            title: 'Заголовок',
            text: 'Текст',
            img: 'Путь к изображению',
            uploadImage: 'Изображение',
            date: 'Дата публикации',
            views: 'Кол-во просмотров',
          },
        },
        Report: {
          properties: {
            img: 'Путь к фотографии',
            uploadImage: 'Фото',
          },
        },
        DocumentSession: {
          properties: {
            file: 'Путь к файлу',
            uploadFile: 'Файл',
            name: 'Документ',
            title: 'Год проведения сессии',
          },
        },
        DocumentReport: {
          properties: {
            file: 'Путь к файлу',
            uploadFile: 'Файл',
            name: 'Документ',
            title: 'Название раздела',
          },
        },
        DocumentBase: {
          properties: {
            file: 'Путь к файлу',
            uploadFile: 'Файл',
            name: 'Документ',
            title: 'Название раздела',
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
        listProperties: [
          'name',
          'uploadImage',
          'post',
          'schedule',
          'appointment',
          'about',
          'uploadFraction',
        ],
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
          uploadFraction: {
            components: {
              edit: AdminBro.bundle('./components/upload-fraction.edit.tsx'),
              list: AdminBro.bundle('./components/upload-fraction.list.tsx'),
            },
          },
        },
        actions: {
          new: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              uploadBeforeFractionHook(modifiedRequest, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              uploadAfterFractionHook(modifiedResponse, req, context);
              return uploadAfterHook(modifiedResponse, req, context);
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context);
              uploadBeforeFractionHook(modifiedRequest, context);
              return uploadBeforeHook(modifiedRequest, context);
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              uploadAfterFractionHook(modifiedResponse, req, context);
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
      resource: Report,
      options: {
        listProperties: ['uploadImage', 'img'],
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
    getDocumentOptions(DocumentSession, 'sessions'),
    getDocumentOptions(DocumentReport, 'reports'),
    getDocumentOptions(DocumentBase, 'base'),
    // {
    //   resource: Document,
    //   options: {
    //     listProperties: ['year'],
    //     editProperties: ['uploadFile', 'year'],
    //     parent: {
    //       name: 'Документы',
    //     },
    //     properties: {
    //       uploadFile: {
    //         components: {
    //           edit: AdminBro.bundle('./components/upload-file.edit.tsx'),
    //         },
    //       },
    //     },
    //     actions: {
    //       new: {
    //         before: async (req, context) => {
    //           const modifiedRequest = await passwordBeforeHook(req, context);
    //           uploadBeforeFileHook(modifiedRequest, context);
    //           return uploadBeforeHook(modifiedRequest, context);
    //         },
    //         after: async (res, req, context) => {
    //           const modifiedResponse = await passwordAfterHook(res, req, context);
    //           uploadAfterFileHook(modifiedResponse, req, context, 'sessions');
    //           return uploadAfterHook(modifiedResponse, req, context);
    //         },
    //       },
    //       edit: {
    //         before: async (req, context) => {
    //           const modifiedRequest = await passwordBeforeHook(req, context);
    //           uploadBeforeFileHook(modifiedRequest, context);
    //           return uploadBeforeHook(modifiedRequest, context);
    //         },
    //         after: async (res, req, context) => {
    //           const modifiedResponse = await passwordAfterHook(res, req, context);
    //           uploadAfterFileHook(modifiedResponse, req, context, 'sessions');
    //           return uploadAfterHook(modifiedResponse, req, context);
    //         },
    //       },
    //     },
    //   },
    // },
  ],
  branding: {
    companyName: 'Совет депутатов ЗАТО г. Железногорск',
  },
};

module.exports = options;
