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
  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var OFFER_PRICE_MIN = 1000;
  var OFFER_PRICE_MAX = 1000000;
  var OFFER_TYPES = ['flat', 'house', 'bungalo'];
  var OFFER_ROOM_MIN = 1;
  var OFFER_ROOM_MAX = 5;
  var OFFER_GUESTS_MIN = 1;
  var OFFER_GUESTS_MAX = 5;
  var OFFER_CHECK_TIMES = ['12:00', '13:00', '14:00'];

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

  //  Функция перемешивает случайным образом массив source
  //  count - кол-во элементов в возвращаемом массиве. Если не указан то count = source.length
  //  count = 'random' - то возвращаемый массив обрезается по случайной длине.
  //  return randomArray (object)
  var generateRandomArray = function (source, count, callback) {
    var randomSequenceIndexes = [];
    var randomArray = [];
    var element;
    var index;
    var random;

    if (!count) {
      count = source.length;
    }

    if (count === 'random') {
      count = Number(getRandomInt(1, source.length + 1));
    }

    //  Собрать случайную последовательность индексов
    for (var i = 0; i < source.length; i++) {
      randomSequenceIndexes[i] = i;
    }
    randomSequenceIndexes.sort(compareRandom);

    //  Обработать обратной связью или по дефолту "перетасовать" source
    if (typeof callback === 'function') {
      for (i = 0; i < source.length; i++) {
        element = source[i];
        index = i;
        random = randomSequenceIndexes[i];
        randomArray[i] = callback(element, index, random);
      }
    } else {
      for (i = 0; i < source.length; i++) {
        randomArray[randomSequenceIndexes[i]] = source[i];
      }
    }

    //  Возможность обрезать массив.
    randomArray.length = count;

    return randomArray;
  };

  //  Функция собирает объект mapPinCard
  //  mapPinCard - сложный объект состоящий из 3-х других простых объектов (objAuthor, objOffer, objLocation)
  //  avatarNumber (int) - номер картинки аватарки
  //  offerTitle (string) - заголовок предложения
  //  return pin (obj)
  var createmapPinCard = function (avatarNumber, offerTitle) {
    var objAuthor = {
      avatar: 'img/avatars/user0' + avatarNumber.toString() + '.png'
    };
    var objLocation = {
      x: getRandomInt(MAP_PIN_X_MIN, MAP_PIN_X_MAX),
      y: getRandomInt(MAP_PIN_Y_MIN, MAP_PIN_Y_MAX)
    };
    var objOffer = {
      title: offerTitle,
      address: objLocation.x + ', ' + objLocation.y,
      price: getRandomInt(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
      type: OFFER_TYPES[getRandomInt(0, OFFER_TYPES.length)],
      rooms: getRandomInt(OFFER_ROOM_MIN, OFFER_ROOM_MAX),
      guests: getRandomInt(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
      checkin: OFFER_CHECK_TIMES[getRandomInt(0, OFFER_CHECK_TIMES.length)],
      checkout: OFFER_CHECK_TIMES[getRandomInt(0, OFFER_CHECK_TIMES.length)],
      features: generateRandomArray(window.utility.offerAvailableFeatures, 'random'),
      description: [],
      photos: []
    };
    var mapPinCard = {
      author: objAuthor,
      offer: objOffer,
      location: objLocation
    };

    return mapPinCard;
  };

  //  Функция генерирует массив объектов mapPinCard
  //  count (int) - кол-во чисел (или максимальное число последовательности)
  //  return arraymapPinCards (object)
  var generatemapPinCards = function (count) {
    var offerTitles = generateRandomArray(OFFER_TITLES);
    return generateRandomArray(offerTitles, count, function (value, index, random) {
      return createmapPinCard(random + 1, value);
    });
  };

  window.data = {
    mapPinCards: generatemapPinCards(MAP_PIN_COUNT),
  };
})();
