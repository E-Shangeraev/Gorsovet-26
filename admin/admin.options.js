const { default: AdminBro } = require('admin-bro')
const uploadFeature = require('@admin-bro/upload')
const AdminBroMongoose = require('@admin-bro/mongoose')
const Admin = require('./admin.resourceOptions')
// const Activity = require('../models/Activity');
const Calendar = require('../models/Calendar')
const Deputie = require('../models/Deputie')
const News = require('../models/News')
const Report = require('../models/Report')
const DocumentSession = require('../models/DocumentSession')
const DocumentReport = require('../models/DocumentReport')
const DocumentBase = require('../models/DocumentBase')
const ActivityWork = require('../models/ActivityWork')
const ActivityHearing = require('../models/ActivityHearing')
const ActivitySession = require('../models/ActivitySession')
const Subscriber = require('../models/Subscriber')
const CardsBlock = require('../models/CardsBlock')
const Cards = require('../models/Card')
const Contacts = require('../models/Contacts')
const ContactsFooter = require('../models/ContactsFooter')
require('dotenv').config()

const {
  before: passwordBeforeHook,
  after: passwordAfterHook,
} = require('./actions/password.hook')
const {
  before: uploadBeforeHook,
  after: uploadAfterHook,
} = require('./actions/upload-image.hook')
const {
  before: uploadBeforeEventHook,
  after: uploadAfterEventHook,
} = require('./actions/upload-event.hook')
const { after: deleteAfterEventHook } = require('./actions/delete-event.hook')
const {
  handler: bulkDeleteEventHook,
} = require('./actions/bulkDelete-event.hook')
const {
  before: uploadBeforeFractionHook,
  after: uploadAfterFractionHook,
} = require('./actions/upload-fraction.hook')
const {
  before: uploadBeforeFileHook,
  after: uploadAfterFileHook,
} = require('./actions/upload-file.hook')
const { after: deleteAfterFileHook } = require('./actions/delete-file.hook')
const {
  handler: bulkDeleteFileHook,
} = require('./actions/bulkDelete-file.hook')
const { after: deleteAfterImageHook } = require('./actions/delete-image.hook')
const {
  handler: bulkDeleteImageHook,
} = require('./actions/bulkDelete-image.hook')

const region = process.env.AWS_REGION
const bucket = process.env.AWS_BUCKET
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const accessKeyId = process.env.AWS_ACCESS_KEY_ID

const features = [
  uploadFeature({
    provider: {
      aws: { region, bucket, secretAccessKey, accessKeyId, expires: 0 },
    },
    properties: {
      filename: 'uploadedFile.filename',
      file: 'uploadedFile',
      key: 'uploadedFile.path',
      bucket: 'uploadedFile.folder',
      size: 'uploadedFile.size',
      mimeType: 'uploadedFile.mime',
      filesToDelete: 'uploadedFile.filesToDelete',
    },
    multiple: true,
  }),
]

AdminBro.registerAdapter(AdminBroMongoose)

const getDocumentOptions = (model, page, category, parent) => ({
  resource: model,
  options: {
    listProperties: ['category', 'year', 'month', 'name'],
    editProperties: [
      'category',
      'year',
      'month',
      'name',
      'uploadFile',
      'filePath',
      'fileName',
    ],
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
          page,
        },
      },
    },
    actions: {
      new: {
        before: async (req, context) => {
          const modifiedRequest = await passwordBeforeHook(req, context)
          return uploadBeforeFileHook(modifiedRequest, context)
        },
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context)
          return uploadAfterFileHook(
            modifiedResponse,
            req,
            context,
            page,
            category,
          )
        },
      },
      edit: {
        before: async (req, context) => {
          const modifiedRequest = await passwordBeforeHook(req, context)
          return uploadBeforeFileHook(modifiedRequest, context)
        },
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context)
          return uploadAfterFileHook(
            modifiedResponse,
            req,
            context,
            page,
            category,
          )
        },
      },
      delete: {
        after: async (res, req, context) => {
          const modifiedResponse = await passwordAfterHook(res, req, context)
          return deleteAfterFileHook(
            modifiedResponse,
            req,
            context,
            page,
            category,
          )
        },
      },
      bulkDelete: {
        actionType: 'bulk',
        handler: async (req, res, context) =>
          bulkDeleteFileHook(req, res, context, page, category),
      },
    },
  },
})

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
        // Activity: 'Деятельность депутатов Совета депутатов',
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
        Subscriber: 'Подписчики',
        CardsBlock: 'Блок с карточками',
        Cards: 'Карточки',
        Contacts: 'Контакты (шапка)',
        ContactsFooter: 'Контакты (подвал)',
      },
      buttons: {
        filter: 'Фильтр',
        save: 'Сохранить',
      },
      resources: {
        // Activity: {
        //   properties: {
        //     title: 'Заголовок',
        //     text: 'Текст',
        //     img: 'Путь к изображению',
        //     uploadImage: 'Изображение',
        //     date: 'Дата публикации',
        //     views: 'Кол-во просмотров',
        //   },
        // },
        Calendar: {
          properties: {
            title: 'Название события',
            filePath: 'Путь к файлу',
            fileName: 'Название файла',
            uploadFile: 'Файл',
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
            fileName: 'Название файла',
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
            fileName: 'Название файла',
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
            fileName: 'Название файла',
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
            fileName: 'Название файла',
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
            fileName: 'Название файла',
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
            fileName: 'Название файла',
          },
        },
        Subscriber: {
          properties: {
            name: 'Имя',
            email: 'Email',
            status: 'Статус',
          },
        },
        CardsBlock: {
          properties: {
            index: 'Порядковый номер',
            title: 'Название блока',
          },
        },
        Cards: {
          properties: {
            index: 'Порядковый номер',
            blockTitle: 'Название блока',
            title: 'Заголовок',
            uploadedFile: 'Документ(ы)',
            contacts: 'Контакты',
            'contacts.to': 'Имя контакта',
            'contacts.phone': 'Номер телефона',
          },
        },
        Contacts: {
          properties: {
            address: 'Адрес',
            workTime: 'График работы',
            phoneNumbers: 'Номера телефонов',
            emails: 'Эл. почты',
          },
        },
        ContactsFooter: {
          properties: {
            phoneNumber: 'Номер телефонa',
            fax: 'Факс',
            email: 'Эл. почта',
          },
        },
      },
    },
  },
  resources: [
    Admin,
    // {
    //   resource: Activity,
    //   options: {
    //     listProperties: ['title', 'text', 'date', 'views', 'uploadImage'],
    //     parent: {
    //       name: 'Депутатский корпус',
    //     },
    //     properties: {
    //       text: {
    //         type: 'richtext',
    //       },
    //       uploadImage: {
    //         components: {
    //           edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
    //           list: AdminBro.bundle('./components/upload-image.list.tsx'),
    //         },
    //       },
    //     },
    //     actions: {
    //       new: {
    //         before: async (req, context) => {
    //           const modifiedRequest = await passwordBeforeHook(req, context)
    //           return uploadBeforeHook(modifiedRequest, context)
    //         },
    //         after: async (res, req, context) => {
    //           const modifiedResponse = await passwordAfterHook(
    //             res,
    //             req,
    //             context
    //           )
    //           return uploadAfterHook(modifiedResponse, req, context)
    //         },
    //       },
    //       edit: {
    //         before: async (req, context) => {
    //           const modifiedRequest = await passwordBeforeHook(req, context)
    //           return uploadBeforeHook(modifiedRequest, context)
    //         },
    //         after: async (res, req, context) => {
    //           const modifiedResponse = await passwordAfterHook(
    //             res,
    //             req,
    //             context
    //           )
    //           return uploadAfterHook(modifiedResponse, req, context)
    //         },
    //       },
    //       delete: {
    //         after: async (res, req, context) => {
    //           const modifiedResponse = await passwordAfterHook(
    //             res,
    //             req,
    //             context
    //           )
    //           return deleteAfterImageHook(modifiedResponse, req, context, [
    //             'img',
    //           ])
    //         },
    //       },
    //       bulkDelete: {
    //         actionType: 'bulk',
    //         handler: async (req, res, context) =>
    //           bulkDeleteImageHook(req, res, context),
    //       },
    //       show: {
    //         isVisible: false,
    //       },
    //     },
    //   },
    // },
    {
      resource: Calendar,
      options: {
        listProperties: ['title', 'date', 'uploadFile'],
        parent: {
          name: 'Главная',
        },
        properties: {
          uploadFile: {
            components: {
              edit: AdminBro.bundle('./components/upload-event.edit.tsx'),
            },
          },
        },
        actions: {
          new: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context)
              return uploadBeforeEventHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return uploadAfterEventHook(
                modifiedResponse,
                req,
                context,
                'calendar',
              )
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context)
              return uploadBeforeEventHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return uploadAfterEventHook(
                modifiedResponse,
                req,
                context,
                'calendar',
              )
            },
          },
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return deleteAfterEventHook(modifiedResponse, req, context)
            },
          },
          bulkDelete: {
            actionType: 'bulk',
            handler: async (req, res, context) =>
              bulkDeleteEventHook(req, res, context),
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
              const modifiedRequest = await passwordBeforeHook(req, context)
              uploadBeforeFractionHook(modifiedRequest, context)
              return uploadBeforeHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              uploadAfterFractionHook(modifiedResponse, req, context)
              return uploadAfterHook(modifiedResponse, req, context)
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context)
              uploadBeforeFractionHook(modifiedRequest, context)
              return uploadBeforeHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              uploadAfterFractionHook(modifiedResponse, req, context)
              return uploadAfterHook(modifiedResponse, req, context)
            },
          },
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return deleteAfterImageHook(modifiedResponse, req, context, [
                'img',
              ])
            },
          },
          bulkDelete: {
            actionType: 'bulk',
            handler: async (req, res, context) =>
              bulkDeleteImageHook(req, res, context),
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
              const modifiedRequest = await passwordBeforeHook(req, context)
              return uploadBeforeHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return uploadAfterHook(modifiedResponse, req, context)
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context)
              return uploadBeforeHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return uploadAfterHook(modifiedResponse, req, context)
            },
          },
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return deleteAfterImageHook(modifiedResponse, req, context, [
                'img',
              ])
            },
          },
          bulkDelete: {
            actionType: 'bulk',
            handler: async (req, res, context) =>
              bulkDeleteImageHook(req, res, context),
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
              const modifiedRequest = await passwordBeforeHook(req, context)
              return uploadBeforeHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return uploadAfterHook(modifiedResponse, req, context)
            },
          },
          edit: {
            before: async (req, context) => {
              const modifiedRequest = await passwordBeforeHook(req, context)
              return uploadBeforeHook(modifiedRequest, context)
            },
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return uploadAfterHook(modifiedResponse, req, context)
            },
          },
          delete: {
            after: async (res, req, context) => {
              const modifiedResponse = await passwordAfterHook(
                res,
                req,
                context,
              )
              return deleteAfterImageHook(modifiedResponse, req, context, [
                'img',
              ])
            },
          },
        },
      },
    },
    {
      resource: Subscriber,
      options: {
        parent: {
          name: 'Администрирование',
        },
        listProperties: ['name', 'email', 'status'],
      },
    },
    getDocumentOptions(DocumentSession, 'documents', 'sessions', 'Документы'),
    getDocumentOptions(DocumentReport, 'documents', 'reports', 'Документы'),
    getDocumentOptions(DocumentBase, 'documents', 'base', 'Документы'),
    getDocumentOptions(ActivityWork, 'activity', 'work', 'Деятельность совета'),
    getDocumentOptions(
      ActivityHearing,
      'activity',
      'hearings',
      'Деятельность совета',
    ),
    getDocumentOptions(
      ActivitySession,
      'activity',
      'sessions',
      'Деятельность совета',
    ),
    {
      resource: CardsBlock,
      options: {
        listProperties: ['index', 'title'],
        editProperties: ['index', 'title'],
        parent: {
          name: 'КРС',
        },
      },
    },
    {
      resource: Cards,
      options: {
        listProperties: [
          'index',
          'blockTitle',
          'title',
          'uploadedFile',
          'contacts',
        ],
        editProperties: [
          'index',
          'blockTitle',
          'title',
          'uploadedFile',
          'contacts',
        ],
        properties: {
          mimeType: { isVisible: false },
        },
        parent: {
          name: 'КРС',
        },
      },
      features,
    },
    {
      resource: Contacts,
      options: {
        listProperties: ['address', 'workTime', 'phoneNumbers', 'emails'],
        editProperties: ['address', 'workTime', 'phoneNumbers', 'emails'],
        parent: {
          name: 'КРС',
        },
      },
    },
    {
      resource: ContactsFooter,
      options: {
        listProperties: ['phoneNumber', 'fax', 'email'],
        editProperties: ['phoneNumber', 'fax', 'email'],
        parent: {
          name: 'КРС',
        },
      },
    },
  ],
  branding: {
    companyName: 'Совет депутатов ЗАТО г. Железногорск',
    logo: '/img/emblem.png',
    softwareBrothers: false,
  },
}

module.exports = options
