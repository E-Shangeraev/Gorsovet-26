$('.open-corpus-popup').magnificPopup({
  type: 'inline',
  midClick: true,
  closeBtnInside: true,
});

$('.open-policy-popup').magnificPopup({
  type: 'inline',
  midClick: true,
  closeBtnInside: true,
});

const photos = document.querySelectorAll('.report__slider img');
const reportItems = Array.from(photos).map((item) => ({
  src: item.src,
  type: 'inline',
}));

console.log(reportItems);

$('.open-report-popup').magnificPopup({
  type: 'image',
  mainClass: 'mfp-with-zoom',
  midClick: true,
  closeBtnInside: true,
  gallery: {
    enabled: true,
  },
  zoom: {
    enabled: true,

    duration: 300, // duration of the effect, in milliseconds
    easing: 'ease-in-out', // CSS transition easing function

    opener: function (openerElement) {
      return openerElement.is('img') ? openerElement : openerElement.find('img');
    },
  },
  removalDelay: 300,
});

$('.open-video-popup').magnificPopup({
  type: 'iframe',
});
