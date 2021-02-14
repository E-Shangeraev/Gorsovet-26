function setupSlider({
  section,
  slidesToShow,
  slidesToScroll,
  rows,
  fade,
  infinite,
  slidesToShow1200 = 1,
  slidesToShow900 = 1,
}) {
  const slickOptions = {
    infinite: infinite,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    prevArrow: $(`${section}__prev`),
    nextArrow: $(`${section}__next`),
    autoplay: false,
    autoplaySpeed: 8000,
    speed: 600,
    cssEase: 'ease-in-out',
    fade: fade,
    pauseOnHover: false,
    waitForAnimate: true,
    rows: rows,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          rows: 1,
          slidesToShow: slidesToShow1200,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          rows: 1,
          slidesToShow: slidesToShow900,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 580,
        settings: {
          rows: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  $(`${section}__slider`).slick(slickOptions);

  const slidesCount = document.querySelectorAll(`${section} .slick-slide`).length;
  const sliderButtons = document.querySelector(`${section} .slider__buttons`);
  let totalSlidesNum = document.querySelector(`${section} .slider__total`);
  let currentSlidesNum = document.querySelector(`${section} .slider__current`);

  if (currentSlidesNum && totalSlidesNum) {
    currentSlidesNum.textContent = document.querySelectorAll(
      `${section} .slick-slide.slick-active`,
    ).length;
    totalSlidesNum.textContent = slidesCount;

    sliderButtons.addEventListener('click', (e) => {
      if (!e.target.closest('button')) return;

      const slides = document.querySelectorAll(`${section} .slick-slide.slick-active`);
      const current = +slides[slides.length - 1].dataset.slickIndex + 1;

      currentSlidesNum.textContent = current;
    });
  }
}

if (fileName === '') {
  setupSlider({
    section: '.promo',
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 1,
    fade: false,
    infinite: true,
  });
  setupSlider({
    section: '.about',
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 2,
    fade: true,
    infinite: true,
  });
  setupSlider({
    section: '.deput',
    slidesToShow: 4,
    slidesToShow1200: 3,
    slidesToScroll: 4,
    rows: 1,
    fade: false,
    infinite: false,
    slidesToShow900: 2,
  });
}

if (fileName === 'corpus') {
  setupSlider({
    section: '.activities',
    slidesToShow: 4,
    slidesToShow1200: 3,
    slidesToScroll: 4,
    rows: 1,
    fade: false,
    infinite: false,
    slidesToShow900: 2,
  });
}

if (fileName === 'news') {
  setupSlider({
    section: '.report',
    slidesToShow: 4,
    slidesToShow1200: 3,
    slidesToScroll: 4,
    rows: 1,
    fade: false,
    infinite: false,
    slidesToShow900: 2,
  });
}

if (fileName === 'council') {
  $('.history__big').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    swipe: false,
    asNavFor: '.history__small',
  });
  $('.history__small').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.history__big',
    arrows: false,
    dots: false,
    centerMode: true,
    focusOnSelect: true,
  });
}
