const previews = document.querySelectorAll('.preview')

previews &&
  previews.forEach(item => {
    const previewTitle = item
      .querySelector('.preview__title')
      .textContent.trim()
    const previewText = item.querySelector('.preview__text')
    const symbolsCount = 250
    const length = symbolsCount - previewTitle.length
    let string = ''

    const paragraphs = previewText.querySelectorAll('p')

    paragraphs.forEach(p => {
      if (string.length < length) {
        string += p.textContent + ' '
      } else if (string.length >= length) {
        string = string.substring(0, length) + '...'
      }
    })
    previewText.innerHTML = ''
    previewText.insertAdjacentHTML('afterbegin', `<p>${string}</p>`)
  })
