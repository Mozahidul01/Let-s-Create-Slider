const imagesArea = document.querySelector(".gallery-area");
const galleryBox = document.querySelector(".gallery-box");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".slide-creator-box");
const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

//Pixabay api key
const KEY = "16354026-c153e2968fabf6a3bf0a9ae62";

//Search handler
const searchImage = () => {
  document.querySelector(".slider-box").style.display = "none";
  clearInterval(timer);
  getImages(search.value);
  sliders.length = 0;
};

search.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

//Collect Data from API
const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => {
      showImages(data.hits);
      console.log(data.hits);
    })
    .catch((err) => console.log(err));
};

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  galleryBox.style.display = "block";

  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "block";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 img-item";
    div.innerHTML = ` 
      <img class="img-fluid img-thumbnail" id="${image.id}" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
      `;
    gallery.appendChild(div);
  });
};

//Image select and unselect for Slider
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  if (item > -1) {
    sliders.pop(img);
    element.classList.remove("added");
  }
  console.log(item, sliders, img);
  selectedImageCount();
};
let timer;

//Selected Image Counter
const selectedImageCount = () => {
  const imageCounter = document.querySelector(".image-counter");
  imageCounter.innerHTML = `
    <p class="counter text-center">Image Selected for Slider: <span class="number">${sliders.length}</span></p>
  `;

  galleryHeader.appendChild(imageCounter);
};

//Slider Creator handler
document.getElementById("duration").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sliderBtn.click();
  }
});

//Slider Create
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }

  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;

  sliderContainer.appendChild(prevNext);

  document.querySelector(".slider-box").style.display = "block";

  // hide image aria
  imagesArea.style.display = "none";
  galleryBox.style.display = "none";

  const duration = document.getElementById("duration").value || 1000;

  if (duration < 0) {
    alert("Please enter a valid duration.");
    return;
  }

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100 slider-img"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item);
  });

  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};
