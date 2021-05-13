const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('landing', {
    title: 'Контрольно-ревизионная служба',
    isKRS: true,
    layout: 'landing',
  })
})

module.exports = router
