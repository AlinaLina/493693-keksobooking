'use strict';

var numberOfObjects = 8;
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var checkTimes = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

// Случайная сортировка массива.
var sortArray = function (arrEnd, arrStart) {
  arrEnd = arrStart.slice(0);
  var createRandom = function () {
    return Math.random() - 0.5;
  };
  return arrEnd.sort(createRandom);
};

// Случайный элемент массива.
var getRandomItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Случайное число.
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * ((max + 1) - min) + min);
};

// Создание объявлений.
var createObject = function () {
  var arrObj = [];
  var randomFeatures = [];
  var randomPhotos = [];
  for (var i = 0; i < numberOfObjects; i++) {
    randomFeatures[i] = sortArray(randomFeatures[i], features);
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
      title: titles[i],
      address: arrObj[i].location.x + ', ' + arrObj[i].location.y,
      price: getRandomNumber(1000, 1000000),
      type: getRandomItem(types),
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(2, 10),
      checkin: getRandomItem(checkTimes),
      checkout: getRandomItem(checkTimes),
      features: randomFeatures[i],
      description: '',
      photos: sortArray(randomPhotos[i], photos)
    };
  }
  return arrObj;
};

// Соответствие типов жилья.
var getOfType = function (type) {
  var mapOfTypes = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  return mapOfTypes[type];
};

// Удаление дочерних элементов.
var removeChildren = function (parent, childrens) {
  for (var i = 0; i < childrens.length; i++) {
    parent.removeChild(childrens[i]);
  }
};
var map = document.querySelector('.map');
var estateObjects = createObject();
var fragment = document.createDocumentFragment();

// Создание пинов.
var createPin = function (number) {
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

// Создание карточки объявления.
var createCardElement = function (object) {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = object.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = object.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getOfType(object.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
  // Список удобств.
  var featureList = cardElement.querySelector('.popup__features');
  var featureElems = featureList.querySelectorAll('li');
  removeChildren(featureList, featureElems);
  for (var i = 0; i < object.offer.features.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + object.offer.features[i] + '');
    featureList.appendChild(li);
  }
  cardElement.querySelector('.popup__description').textContent = object.offer.description;
  // Вставка фотографий.
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
  cardElement.querySelector('.popup__avatar').src = object.author.avatar;
  return cardElement;
};

map.classList.remove('map--faded');
document.querySelector('.map__pins').appendChild(createPin(numberOfObjects));
map.insertBefore(createCardElement(estateObjects[0]), map.querySelector('.map__filters-container'));
