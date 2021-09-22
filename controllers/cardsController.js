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
      item.uploadedFile.filename = item.uploadedFile.filename
        .join(',')
        .replace(/-/g, ' ')
        .split(',')
      return item
    })

    cardsBlock = sortByField(cardsBlock, 'index')

    const blocks = cardsBlock.map(block => ({
      blockTitle: block.title,
      cards: cards.filter(card => card.blockTitle.title === block.title),
    }))

    // console.log(newCards[0].cards)
    // console.log(newCards[1])

    res.render('landing', {
      title: 'Контрольно-ревизионная служба',
      isKRS: true,
      layout: 'landing',
      blocks,
    })
  }
}

module.exports = new CardsController()
