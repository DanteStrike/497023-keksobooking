'use strict';
//  Дано
//  Кол-во "кнопок"
var MAP_PIN_COUNT = 8;

//  Границы координат "кнопок"
var MAP_PIN_X_MIN = 300;
var MAP_PIN_X_MAX = 900;
var MAP_PIN_Y_MIN = 100;
var MAP_PIN_Y_MAX = 500;

//  Константы для описания предложения
var OFFER_TITELS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_PRICE_MIN = 1000;
var OFFER_PRICE_MAX = 1000000;
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_ROOM_MIN = 1;
var OFFER_ROOM_MAX = 5;
var OFFER_GUESTS_MIN = 1;
var OFFER_GUESTS_MAX = 5;
var OFFER_CHECK_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_AVAILABLE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

//  Функция генерирует случайное целое число в промежутке от min до max
//  min, max (int)
//  return (int)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//  Функция случайно сравнивает поступающие данные
//  a, b (int)
//  return (boolean)
var compareRandom = function (a, b) {
  return Math.random() - 0.5;
}

//  Функция генерирует массив из рандомных неповторяющихся чисел от 1 до count
//  count (int) - кол-во чисел (или максимальное число последовательности)
//  return array (object)
var generateRandomArray = function (count) {
  var i = 0;
  var array = [];

  for (i = 0; i < count; i++) {
    array[i] = i + 1;
  }

  return array.sort(compareRandom);
};

//  Функция генерирует случайный массив строк загаловков
//  count (int) - кол-во чисел (или максимальное число последовательности)
//  return arrayTitels (object)
var generateTitelsArray = function (count) {
  var i = 0;
  var array = [];
  var arrayTitels = [];

  array = generateRandomArray(count);
  array.sort(compareRandom);

  arrayTitels.length = array.length;
  for (i = 0; i < count; i++) {
    arrayTitels[array[i] - 1] = OFFER_TITELS[i];
  }

  return arrayTitels;
};

//  Функция собирает объект Author
//  objAuthor (obj) - пустой объект для заполнения
//  avatarNumber (int)
var createObjAuthor = function (objAuthor, avatarNumber) {
  var avatarNumberStr = '';

  //  Согласно заданию должен быть ведущий 0. Например 01, 02 и т. д.
  avatarNumber > 9 ? avatarNumberStr = avatarNumber.toString() : avatarNumberStr = '0' + avatarNumber.toString();

  return objAuthor = {
    avatar: 'img/avatars/user'+avatarNumberStr+'.png'
  };
};

//  Функция собирает объект Location
//  objLocation (obj) - пустой объект для заполнения
//  Размеры картинки аватарки = 40 х 40, размер указателя = 10х18 => смещение с левого верхнего угла
//  dх = х + 20
//  dy = y + 40 + 18
var createObjLocation = function (objLocation) {
  return objLocation = {
    x: getRandomInt(MAP_PIN_X_MIN, MAP_PIN_X_MAX) + 20,
    y: getRandomInt(MAP_PIN_Y_MIN, MAP_PIN_Y_MAX) + 40 + 18
  };
};

//  Функция генерирует случайный массив строк (features)
//  strArray (obj) - массив откуда выбирать
//  return features (string) - массив строк для Offer
var getRandomOfferFeatures = function () {
  var features = [];
  var i = 0;
  var count = 0;

  count = getRandomInt(1, OFFER_AVAILABLE_FEATURES.length);
  features = generateRandomArray(count);
  for (i = 0; i < features.length; i++) {
    features[i] = OFFER_AVAILABLE_FEATURES[features[i] - 1];
  }
  return features.sort();
};

//  Функция собирает объект Offer
//  objOffer (obj) - пустой объект для заполнения
//  offerTitel (string) - Название предложения
//  objLocation (obj) - Предложение зависимо от локации
var createObjOffer = function (objOffer, offerTitel, objLocation) {
  return objOffer = {
    title: offerTitel,
    address: objLocation.x + ', ' + objLocation.y,
    price: getRandomInt(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
    type: OFFER_TYPES[getRandomInt(0, OFFER_TYPES.length)],
    rooms: getRandomInt(OFFER_ROOM_MIN, OFFER_ROOM_MAX),
    guests: getRandomInt(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
    checkin: OFFER_CHECK_TIMES[getRandomInt(0, OFFER_CHECK_TIMES.length)],
    checkout: OFFER_CHECK_TIMES[getRandomInt(0, OFFER_CHECK_TIMES.length)],
    features: getRandomOfferFeatures(),
    description: [],
    photos: []
  };
};

//  Функция собирает объект Pin
//  Pin - сложный объект состоящий из 3-х других простых объектов (objAuthor, objOffer, objLocation)
//  objLocation (obj) - пустой объект для заполнения
var createPin = function (avatarNumber, offerTitel) {
  var pin = {};
  var objAuthor = {};
  var objOffer = {};
  var objLocation = {};

  objAuthor = createObjAuthor(objAuthor, avatarNumber);
  objLocation = createObjLocation(objLocation);
  objOffer = createObjOffer(objOffer ,offerTitel, objLocation);

  return pin = {
    author: objAuthor,
    offer: objOffer,
    location: objLocation
  };
};

//  Функция генерирует массив объектов Pin
//  count (int) - кол-во чисел (или максимальное число последовательности)
//  return arrayPins (object)
var generatePins = function (count) {
  var i = 0;
  var avatarNumbers = [];
  var offerTitels = [];
  var arrayPins = [];

  avatarNumbers = generateRandomArray(count);
  offerTitels = generateTitelsArray(count);
  arrayPins.length = count;
  for (i = 0; i < count; i++) {
    arrayPins[i] = createPin(avatarNumbers[i], offerTitels[i]);
  }

  return arrayPins;
};

console.log(generatePins(MAP_PIN_COUNT));
