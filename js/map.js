'use strict';
//  Дано
//  Кол-во "кнопок"
var MAP_PIN_COUNT = 8;

//  Границы координат "кнопок"
var MAP_PIN_X_MIN = 300;
var MAP_PIN_X_MAX = 900;
var MAP_PIN_Y_MIN = 100;
var MAP_PIN_Y_MAX = 500;

//  смещение координат с левого верхнего угла в левый нижний
//  dх = х + 5
//  dy = MAX_H - y - 40
var MAP_PIN_X_DELTA = 5;
var MAP_PIN_Y_DELTA = 40;

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

var mapPins;
var mapNode = document.querySelector('.map');
var mapPinsNode = document.querySelector('.map .map__pins');
var mapFiltersContainerNode = document.querySelector('.map .map__filters-container');

//  Функция генерирует случайное целое число в промежутке от min до max
//  min, max (int)
//  return (int)
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

//  Функция случайным образом сравнивает поступающие данные
//  a, b (int)
//  return (boolean)
var compareRandom = function (a, b) {
  return Math.random() - 0.5;
};

//  Функция генерирует массив из рандомных неповторяющихся чисел от 0 до count - 1
//  count (int) - кол-во чисел (или максимальное число последовательности)
//  return array (object)
var generateRandomArray = function (count) {
  var i;
  var array = [];

  for (i = 0; i < count; i++) {
    array.push(i);
  }

  return array.sort(compareRandom);
};

//  Функция генерирует случайный массив строк загаловков
//  count (int) - кол-во чисел (или максимальное число последовательности)
//  return arrayTitels (object)
var generateTitelsArray = function (count) {
  var i;
  var array = generateRandomArray(count);
  var arrayTitels = [];

  arrayTitels.length = array.length;
  for (i = 0; i < count; i++) {
    arrayTitels[array[i]] = OFFER_TITELS[i];
  }

  return arrayTitels;
};

//  Функция собирает объект Author
//  objAuthor (obj) - объект для заполнения
//  avatarNumber (int) - номер картинки аватарки
//  return objAuthor (object)
var createObjAuthor = function (objAuthor, avatarNumber) {
  var avatarNumberStr;

  //  Согласно заданию должен быть ведущий 0. Например 01, 02 и т. д.
  avatarNumber > 9 ? avatarNumberStr = avatarNumber.toString() : avatarNumberStr = '0' + avatarNumber.toString();

  return objAuthor = {
    avatar: 'img/avatars/user'+avatarNumberStr+'.png'
  };
};

//  Функция собирает объект Location
//  objLocation (obj) - объект для заполнения
//  return objLocation (object)
var createObjLocation = function (objLocation) {
  return objLocation = {
    x: getRandomInt(MAP_PIN_X_MIN, MAP_PIN_X_MAX),
    y: getRandomInt(MAP_PIN_Y_MIN, MAP_PIN_Y_MAX)
  };
};

//  Функция генерирует случайный массив строк (features)
//  strArray (obj) - массив откуда выбирать
//  return features (string) - массив строк для Offer
var getRandomOfferFeatures = function () {
  var count = getRandomInt(1, OFFER_AVAILABLE_FEATURES.length);
  var features = generateRandomArray(count);
  var i;

  for (i = 0; i < features.length; i++) {
    features[i] = OFFER_AVAILABLE_FEATURES[features[i]];
  }

  return features.sort();
};

//  Функция собирает объект Offer
//  objOffer (obj) - пустой объект для заполнения
//  offerTitel (string) - Название предложения
//  objLocation (obj) - Предложение зависимо от локации
//  return objOffer (object)
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

//  Функция собирает объект mapPin
//  mapPin - сложный объект состоящий из 3-х других простых объектов (objAuthor, objOffer, objLocation)
//  avatarNumber (int) - номер картинки аватарки
//  offerTitel (string) - заголовок предложения
//  return pin (obj)
var createMapPin = function (avatarNumber, offerTitel) {
  var mapPin;
  var objAuthor = createObjAuthor(objAuthor, avatarNumber);
  var objLocation = createObjLocation(objLocation);
  var objOffer = createObjOffer(objOffer, offerTitel, objLocation);

  return mapPin = {
    author: objAuthor,
    offer: objOffer,
    location: objLocation
  };
};

//  Функция генерирует массив объектов mapPin
//  count (int) - кол-во чисел (или максимальное число последовательности)
//  return arrayMapPins (object)
var generateMapPins = function (count) {
  var i;
  var avatarNumbers = generateRandomArray(count);
  var offerTitels = generateTitelsArray(count);
  var arrayMapPins = [];

  arrayMapPins.length = count;
  for (i = 0; i < count; i++) {
    arrayMapPins[i] = createMapPin(avatarNumbers[i] + 1, offerTitels[i]);
  }

  return arrayMapPins;
};

//  Функция клонирует и собирает DOM элемент шаблона (template) '.map__pin' по объекту mapPin
//  mapPin (object)
//  return mapPinNode (object) - вернуть собранный узел
var buildMapPinNode = function (mapPin) {
  var mapPinNode = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
  var mapPinNodeAvatar = mapPinNode.querySelector('img');

  mapPinNode.style.left = (mapPin.location.x - MAP_PIN_X_DELTA) + 'px';

  // mapNode.clientHeight (замыкание для определения смещения от верха, если известно только смещение снизу)
  mapPinNode.style.top = (mapNode.clientHeight - mapPin.location.y - MAP_PIN_Y_DELTA) + 'px';
  mapPinNodeAvatar.src = mapPin.author.avatar;

  return mapPinNode;
};

//  Функция создает фрагмент с DOM элементами шаблона (template) '.map__pin', согласно массиву объектов mapPins
//  mapPins (object) - массив объектов
//  return fragment (object) - вернуть собранный фрагмент
var createMapPinsNode = function (mapPins) {
  var fragment = document.createDocumentFragment();
  var i;

  for (i = 0; i < mapPins.length; i++) {
    fragment.appendChild(buildMapPinNode(mapPins[i]));
  }

  return fragment;
};

//  Функция, путем удаления, убирает все недоступные 'удобства' из узла, которых нет в массиве (features)
//  node (object) - узел содержащий ВСЕ возможные удобства
//  features (object) - массив текущих удобств
//  return node (object) - вернуть узел
var buildMapCardFeatures = function (node, features) {
  var flag;
  var i;
  var j;

  for (i = 0; i < OFFER_AVAILABLE_FEATURES.length; i++) {
    flag = false;
    for (j = 0; j < features.length; j++) {
      if (OFFER_AVAILABLE_FEATURES[i] === features[j]) {
        flag = true;
        break;
      }
    }
    if (flag !== true) {
      node.removeChild(node.querySelector('.feature--' + OFFER_AVAILABLE_FEATURES[i]));
    }
  }

  return node;
};

//  Функция создает DOM элемент шаблона (template) 'article.map__card', согласно массиву объектов mapPins
//  mapPin (object) - объект mapPin
//  return mapCardNode (object) - вернуть узел
var buildMapCard = function (mapPin) {
  var mapCardNode = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);
  var mapCardNodeAvatar = mapCardNode.querySelector('.popup__avatar');
  var mapCardNodeTitle = mapCardNode.querySelector('h3');
  var mapCardNodeAddress = mapCardNode.querySelector('p:first-of-type');
  var mapCardNodePrice = mapCardNode.querySelector('.popup__price');
  var mapCardNodeType = mapCardNode.querySelector('h4');
  var mapCardNodeRoomsGuests = mapCardNode.querySelector('p:nth-of-type(3)');
  var mapCardNodeCheckInOut = mapCardNode.querySelector('p:nth-of-type(4)');
  var mapCardNodeFeatures = mapCardNode.querySelector('.popup__features');
  var mapCardNodeDescription = mapCardNode.querySelector('p:last-of-type');

  mapCardNodeAvatar.src = mapPin.author.avatar;
  mapCardNodeTitle.textContent = mapPin.offer.title;
  mapCardNodeAddress.textContent = mapPin.offer.address;
  mapCardNodePrice.textContent = mapPin.offer.price + '	\u20BD/ночь';
  mapCardNodeType.textContent =  mapPin.offer.type;
  mapCardNodeRoomsGuests.textContent =  mapPin.offer.rooms + ' комнаты для ' + mapPin.offer.guests + ' гостей';
  mapCardNodeCheckInOut.textContent = 'Заезд после ' + mapPin.offer.checkin + ', выезд до ' + mapPin.offer.checkout;
  mapCardNodeFeatures =  buildMapCardFeatures(mapCardNodeFeatures, mapPin.offer.features);
  mapCardNodeDescription.textContent =  mapPin.offer.description;

  return mapCardNode;
};

//  Функция создает элемент DIV с DOM элементами шаблона (template) 'article.map__card', согласно массиву объектов mapPins
//  mapPins (object) - массив объектов
//  return divNode (object) - вернуть собранный элемент DIV
var createMapCards = function (mapPins) {
  var divNode = document.createElement('div');
  var i;

  divNode.className = 'map__cards';
  for (i = 0; i < mapPins.length; i++) {
    divNode.appendChild(buildMapCard(mapPins[i]));
  }

  return divNode;
};


//  1) Сгенерировать объекты
mapPins = generateMapPins(MAP_PIN_COUNT);

//  2) "Открыть карту"
mapNode.classList.remove('map--faded');

//  3) Создать и внедрить фрагмент с DOM элементами "кнопок"
mapPinsNode.appendChild(createMapPinsNode(mapPins));

//  4) Создать и внедрить DIV c DOM элементами предложений
mapNode.insertBefore(createMapCards(mapPins), mapFiltersContainerNode);
