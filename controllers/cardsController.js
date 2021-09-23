const CardsModel = require('../models/Card')
const CardsBlockModel = require('../models/CardsBlock')

function sortByField(array, field) {
  return array.sort((a, b) => {
    if (a[field] > b[field]) {
      return 1
    }
    if (a[field] < b[field]) {
      return -1
    }
    return 0
  })
}

class CardsController {
  constructor() {}

  async getAll(req, res) {
    let cards = await CardsModel.find()
      .sort({ index: 1 })
      .populate('blockTitle')
      .lean()
    let cardsBlock = await CardsBlockModel.find().lean()

    cards = sortByField(cards, 'blockTitle.index')

    cards = cards.map(item => {
      if (item.uploadedFile) {
        item.uploadedFile.years = item.uploadedFile.filename
          .join(',')
          .match(/\d\d\d\d/g)
        item.uploadedFile.filename = item.uploadedFile.filename
          .join(',')
          .replace(/\d\d\d\d--/g, ' ')
          .replace(/-/g, ' ')
          .split(',')
      }
      return item
    })

    cardsBlock = sortByField(cardsBlock, 'index')

    const blocks = cardsBlock.map(block => ({
      blockTitle: block.title,
      cards: cards.filter(card => card.blockTitle.title === block.title),
    }))

    res.render('landing', {
      title: 'Контрольно-ревизионная служба',
      isKRS: true,
      layout: 'landing',
      blocks,
    })
  }
}

module.exports = new CardsController()
