const CardsModel = require('../models/Card')
const CardsBlockModel = require('../models/CardsBlock')
const ContactsModel = require('../models/Contacts')
const ContactsFooterModel = require('../models/ContactsFooter')

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

class LandingController {
  getCardBlocks = async () => {
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

    return blocks
  }
  getContacts = async () => {
    const contacts = await ContactsModel.findOne().lean()
    const contactsFooter = await ContactsFooterModel.findOne().lean()

    return {
      contacts,
      contactsFooter,
    }
  }
  render = async (req, res) => {
    const blocks = await this.getCardBlocks()
    const contacts = await this.getContacts()

    res.render('landing', {
      title: 'Контрольно-ревизионная служба',
      isKRS: true,
      layout: 'landing',
      blocks,
      ...contacts,
    })
  }
}

module.exports = new LandingController()
