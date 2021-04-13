const preloader = document.querySelector('#page-preloader');
const loading = document.querySelector('.preloader__loading span');
let images = document.images;
const imagesTotalCount = images.length;
let imagesLoadedCount = 0;
let percentLoad = 0;

for (let i = 0; i < imagesTotalCount; i++) {
  imageClone = new Image();
  imageClone.onload = imageLoaded;
  imageClone.onerror = imageLoaded;
  imageClone.src = images[i].src;
}

function imageLoaded() {
  imagesLoadedCount++;
  percentLoad = Math.ceil((100 / imagesTotalCount) * imagesLoadedCount) + '%';
  loading.style.width = percentLoad;

  if (imagesLoadedCount >= imagesTotalCount) {
    setTimeout(() => {
      if (!preloader.classList.contains('done')) {
        preloader.classList.add('done');
        document.body.style.overflowY = 'auto';
      }
    }, 1500);
  }
}
