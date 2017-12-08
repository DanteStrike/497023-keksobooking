'use strict';

//  data.js — модуль, который создает данные

(function () {
  //  Дано
  //  Кол-во "кнопок"
  var MAP_PIN_COUNT = 8;

  //  Границы координат "кнопок"
  var MAP_PIN_X_MIN = 300;
  var MAP_PIN_X_MAX = 900;
  var MAP_PIN_Y_MIN = 100;
  var MAP_PIN_Y_MAX = 500;

  //  Константы для описания предложения
  var OFFER_Titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
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
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  //  Функция случайным образом сравнивает поступающие данные
  //  return (boolean)
  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  //  Функция генерирует массив из рандомных неповторяющихся чисел от 0 до count - 1
  //  count (int) - кол-во чисел (или максимальное число последовательности)
  //  return array (object)
  var generateRandomArray = function (count) {
    var array = [];

    for (var i = 0; i < count; i++) {
      array[i] = i;
    }

    return array.sort(compareRandom);
  };

  //  Функция генерирует случайный массив строк загаловков
  //  count (int) - кол-во чисел (или максимальное число последовательности)
  //  return arrayTitles (object)
  var generateTitlesArray = function (count) {
    var array = generateRandomArray(count);
    var arrayTitles = [];

    for (var i = 0; i < count; i++) {
      arrayTitles[array[i]] = OFFER_Titles[i];
    }

    return arrayTitles;
  };

  //  Функция генерирует случайный массив строк со случайной длинной (features)
  //  strArray (obj) - массив откуда выбирать
  //  return features (string) - массив строк для Offer
  var getRandomOfferFeatures = function () {
    var count = getRandomInt(1, OFFER_AVAILABLE_FEATURES.length + 1);
    var features = generateRandomArray(OFFER_AVAILABLE_FEATURES.length);

    //  Обрезание массива по случайной длине
    features.length = count;
    for (var i = 0; i < features.length; i++) {
      features[i] = OFFER_AVAILABLE_FEATURES[features[i]];
    }

    return features;
  };

  //  Функция собирает объект mapPin
  //  mapPin - сложный объект состоящий из 3-х других простых объектов (objAuthor, objOffer, objLocation)
  //  avatarNumber (int) - номер картинки аватарки
  //  offerTitel (string) - заголовок предложения
  //  return pin (obj)
  var createMapPin = function (avatarNumber, offerTitel) {
    var objAuthor = {
      avatar: 'img/avatars/user0' + avatarNumber.toString() + '.png'
    };
    var objLocation = {
      x: getRandomInt(MAP_PIN_X_MIN, MAP_PIN_X_MAX),
      y: getRandomInt(MAP_PIN_Y_MIN, MAP_PIN_Y_MAX)
    };
    var objOffer = {
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
    var mapPin = {
      author: objAuthor,
      offer: objOffer,
      location: objLocation
    };

    return mapPin;
  };

  //  Функция генерирует массив объектов mapPin
  //  count (int) - кол-во чисел (или максимальное число последовательности)
  //  return arrayMapPins (object)
  var generateMapPins = function (count) {
    var avatarNumbers = generateRandomArray(count);
    var offerTitles = generateTitlesArray(count);
    var arrayMapPins = [];

    for (var i = 0; i < count; i++) {
      arrayMapPins[i] = createMapPin(avatarNumbers[i] + 1, offerTitles[i]);
    }

    return arrayMapPins;
  };

  window.data = {
    mapPin: generateMapPins(MAP_PIN_COUNT)
  };
})();
