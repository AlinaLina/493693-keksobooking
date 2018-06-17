'use strict';

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_X_POSITION = 570;
var MAIN_PIN_Y_POSITION = 370;
var NUMBER_OF_OBJECTS = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var sortArray = function (arrEnd, arrStart) {
  arrEnd = arrStart.slice(0);
  var createRandom = function () {
    return Math.random() - 0.5;
  };
  return arrEnd.sort(createRandom);
};

var getRandomItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * ((max + 1) - min) + min);
};

var createObject = function () {
  var arrObj = [];
  var randomFeatures = [];
  var randomPhotos = [];
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    randomFeatures[i] = sortArray(randomFeatures[i], FEATURES);
    randomFeatures[i].length = getRandomNumber(1, randomFeatures[i].length);
    arrObj[i] = {};
    arrObj[i].author = {
      avatar: 'img/avatars/user' + '0' + (i + 1) + '.png'
    };
    arrObj[i].location = {
      x: getRandomNumber(300, 900),
      y: getRandomNumber(130, 630)
    };
    arrObj[i].offer = {
      title: TITLES[i],
      address: arrObj[i].location.x + ', ' + arrObj[i].location.y,
      price: getRandomNumber(1000, 1000000),
      type: getRandomItem(TYPES),
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(2, 10),
      checkin: getRandomItem(CHECK_TIMES),
      checkout: getRandomItem(CHECK_TIMES),
      features: randomFeatures[i],
      description: '',
      photos: sortArray(randomPhotos[i], photos)
    };
  }
  return arrObj;
};

var getOfType = function (type) {
  var mapOfTypes = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  return mapOfTypes[type];
};

var removeChildren = function (parent, children) {
  for (var i = 0; i < children.length; i++) {
    parent.removeChild(children[i]);
  }
};
var map = document.querySelector('.map');
var estateObjects = createObject();

var createPin = function (number) {
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  for (var i = 0; i < number; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (estateObjects[i].location.x - PIN_WIDTH / 2) + 'px; top: ' + (estateObjects[i].location.y - PIN_HEIGHT) + 'px';
    pinElement.querySelector('img').src = estateObjects[i].author.avatar;
    pinElement.querySelector('img').alt = estateObjects[i].offer.title;
    fragment.appendChild(pinElement);
  }
  return fragment;
};

var pinsFragment = createPin(NUMBER_OF_OBJECTS);
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var cardElement = cardTemplate.cloneNode(true);

var getPinPosition = function (startX, startY, width, height) {
  return (Math.round(startX + width / 2) + ', ' + (startY + height));
};

var createFeatures = function (object) {
  var featureList = cardElement.querySelector('.popup__features');
  var featureElems = featureList.querySelectorAll('li');
  removeChildren(featureList, featureElems);
  for (var i = 0; i < object.offer.features.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + object.offer.features[i] + '');
    featureList.appendChild(li);
  }
};

var createPhotos = function (object) {
  var photosList = cardElement.querySelector('.popup__photos');
  var photosElems = photosList.querySelectorAll('img');
  removeChildren(photosList, photosElems);
  for (i = 0; i < object.offer.photos.length; i++) {
    var img = document.createElement('img');
    img.classList.add('popup__photo');
    img.src = object.offer.photos[i];
    img.width = 45;
    img.height = 40;
    img.alt = 'Фотография жилья';
    photosList.appendChild(img);
  }
};

var onCardElementClosePress = function (evt) {
  if (evt.target === map.querySelector('.popup__close')) {
    cardElement.classList.add('hidden');
    cardElement.removeEventListener('click', onCardElementClosePress);
  }
};

var cardElementOpen = function () {
  cardElement.classList.remove('hidden');
  cardElement.addEventListener('click', onCardElementClosePress);
};

var createCardElement = function (object) {
  cardElementOpen();
  cardElement.querySelector('.popup__title').textContent = object.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = object.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getOfType(object.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
  createFeatures(object);
  cardElement.querySelector('.popup__description').textContent = object.offer.description;
  createPhotos(object);
  cardElement.querySelector('.popup__avatar').src = object.author.avatar;
  return cardElement;
};

var mainPin = map.querySelector('.map__pin--main');
var fieldsets = document.querySelectorAll('fieldset');

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', true);
}

document.querySelector('#address').value = getPinPosition(MAIN_PIN_X_POSITION, MAIN_PIN_Y_POSITION, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);

mainPin.addEventListener('mouseup', function () {
  map.classList.remove('map--faded');
  for (i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled');
  }
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  document.querySelector('#address').value = getPinPosition(MAIN_PIN_X_POSITION, MAIN_PIN_Y_POSITION, PIN_WIDTH, PIN_HEIGHT);
  map.querySelector('.map__pins').appendChild(pinsFragment);
});

map.addEventListener('click', function (evt) {
  var target;
  if (evt.target.tagName === 'BUTTON' && evt.target !== map.querySelector('.map__pin--main') && evt.target !== map.querySelector('.popup__close')) {
    target = evt.target;
  } else if (evt.target.parentNode.tagName === 'BUTTON' && evt.target.parentNode !== map.querySelector('.map__pin--main')) {
    target = evt.target.parentNode;
  }
  if (target) {
    var card = createCardElement(estateObjects[target.getAttribute('data-number')]);
    map.insertBefore(card, map.querySelector('.map__filters-container'));
  }
});
