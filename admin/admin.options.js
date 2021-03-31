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
const ActivityWork = require('../models/ActivityWork');
const ActivityHearing = require('../models/ActivityHearing');
const ActivitySession = require('../models/ActivitySession');

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
const { after: deleteAfterFileHook } = require('./actions/delete-file.hook');
const { after: deleteAfterImageHook } = require('./actions/delete-image.hook');

AdminBro.registerAdapter(AdminBroMongoose);

const getDocumentOptions = (model, page, category, parent) => ({
  resource: model,
  options: {
    listProperties: ['category', 'year', 'month', 'name'],
    editProperties: ['category', 'year', 'month', 'name', 'uploadFile', 'filePath', 'fileName'],
    parent: {
      name: parent,
    },
    properties: {
      uploadFile: {
        components: {
          edit: AdminBro.bundle('./components/upload-file.edit.tsx'),
        },
        props: {
          category,
        },
      },
    },
    actions: {
      new: {
        before: async (req, context) => {
          const modifiedRequest = await passwordBeforeHook(req, context);
          return uploadBeforeFileHook(modifiedRequest, context);
        },
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context);
          return uploadAfterFileHook(modifiedResponse, req, context, page, category);
        },
      },
      edit: {
        before: async (req, context) => {
          const modifiedRequest = await passwordBeforeHook(req, context);
          return uploadBeforeFileHook(modifiedRequest, context);
        },
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context);
          return uploadAfterFileHook(modifiedResponse, req, context, page, category);
        },
      },
      delete: {
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context);
          return deleteAfterFileHook(modifiedResponse, req, context, page, category);
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
        list: 'Записи',
        search: 'Искать',
      },
      labels: {
        Admin: 'Администраторы',
        Activity: 'Деятельность депутатов Совета депутатов',
        Calendar: 'Календарь событий',
        Deputie: 'Депутатский корпус',
        News: 'Новости',
        Report: 'Медиаотчет',
        DocumentSession: 'Решения сессии',
        DocumentReport: 'Отчёты о деятельности',
        DocumentBase: 'Нормативная правовая база',
        ActivityWork: 'Работа комиссий',
        ActivityHearing: 'Публичные слушания',
        ActivitySession: 'Сессии',
        Comission: 'Постоянные комиссии',
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
            id: 'Порядковый номер',
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
            video: 'Видео',
          },
        },
        DocumentSession: {
          properties: {
            category: 'Категория',
            year: 'Год',
            month: 'Месяц',
            name: 'Название документа',
            filePath: 'Путь к файлу',
            uploadFile: 'Файл',
          },
        },
        DocumentReport: {
          properties: {
            category: 'Категория',
            year: 'Год',
            month: 'Месяц',
            name: 'Название документа',
            filePath: 'Путь к файлу',
            uploadFile: 'Файл',
          },
        },
        DocumentBase: {
          properties: {
            category: 'Категория',
            year: 'Год',
            month: 'Месяц',
            name: 'Название документа',
            filePath: 'Путь к файлу',
            uploadFile: 'Файл',
          },
        },
        ActivityWork: {
          properties: {
            category: 'Категория',
            year: 'Год',
            month: 'Месяц',
            name: 'Название документа',
            filePath: 'Путь к файлу',
            uploadFile: 'Файл',
          },
        },
        ActivityHearing: {
          properties: {
            category: 'Категория',
            year: 'Год',
            month: 'Месяц',
            name: 'Название документа',
            filePath: 'Путь к файлу',
            uploadFile: 'Файл',
          },
        },
        ActivitySession: {
          properties: {
            category: 'Категория',
            year: 'Год',
            month: 'Месяц',
            name: 'Название документа',
            filePath: 'Путь к файлу',
            uploadFile: 'Файл',
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
          name: 'Депутатский корпус',
        },
        properties: {
          text: {
            type: 'richtext',
          },
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
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return deleteAfterImageHook(modifiedResponse, req, context, ['img']);
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
          name: 'Главная',
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
          'id',
          'name',
          'uploadImage',
          'post',
          'schedule',
          'appointment',
          'about',
          'uploadFraction',
        ],
        parent: {
          name: 'Депутатский корпус',
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
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return deleteAfterImageHook(modifiedResponse, req, context, ['img']);
            },
          },
        },
      },
    },
    {
      resource: News,
      options: {
        listProperties: ['title', 'text', 'uploadImage', 'date', 'views'],
        parent: {
          name: 'Новости',
        },
        properties: {
          text: {
            type: 'richtext',
          },
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
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return deleteAfterImageHook(modifiedResponse, req, context, ['img']);
            },
          },
        },
      },
    },
    {
      resource: Report,
      options: {
        listProperties: ['uploadImage', 'video'],
        parent: {
          name: 'Новости',
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
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(res, req, context);
              return deleteAfterImageHook(modifiedResponse, req, context, ['img']);
            },
          },
        },
      },
    },
    getDocumentOptions(DocumentSession, 'documents', 'sessions', 'Документы'),
    getDocumentOptions(DocumentReport, 'documents', 'reports', 'Документы'),
    getDocumentOptions(DocumentBase, 'documents', 'base', 'Документы'),
    getDocumentOptions(ActivityWork, 'activity', 'work', 'Деятельность совета'),
    getDocumentOptions(ActivityHearing, 'activity', 'hearings', 'Деятельность совета'),
    getDocumentOptions(ActivitySession, 'activity', 'sessions', 'Деятельность совета'),
  ],
  branding: {
    companyName: 'Совет депутатов ЗАТО г. Железногорск',
    logo: '/img/emblem.png',
    softwareBrothers: false,
  },
};

module.exports = options;
