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

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var TITLE_INPUT_MIN_LENGTH = 30;
var TITLE_INPUT_MAX_LENGTH = 100;

var PRICE_INPUT_MIN_DEFAULT = 0;
var PRICE_INPUT_MIN_FLATE = 0;
var PRICE_INPUT_MIN_BUNGALO = 1000;
var PRICE_INPUT_MIN_HOUSE = 5000;
var PRICE_INPUT_MIN_PALACE = 1000000;
var PRICE_INPUT_MAX_VALUE = 1000000;

var priceInputMin = PRICE_INPUT_MIN_DEFAULT;

var mapPins;
var mapNode = document.querySelector('.map');
var mapFiltersContainerNode = mapNode.querySelector('.map__filters-container');
var mapPinsNode = mapNode.querySelector('.map__pins');
var mapPinMain = mapPinsNode.querySelector('.map__pin--main');
var mapGeneratedPins;
var mapGeneratedCards;
var mapCardsNode;

var noticeForm = document.querySelector('.notice__form');
var noticeFormTitleInput = noticeForm.querySelector('#title');
var noticeFormAddressInput = noticeForm.querySelector('#address');
var noticeFormPriceInput = noticeForm.querySelector('#price');
var noticeFormTimeInSelect = noticeForm.querySelector('#timein');
var noticeFormTimeOutSelect = noticeForm.querySelector('#timeout');
var noticeFormTypeSelect = noticeForm.querySelector('#type');
var noticeFormRoomstSelect = noticeForm.querySelector('#room_number');
var noticeFormCapacitySelect = noticeForm.querySelector('#capacity');

var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');


//  Переключатели видимости узла
var hideNode = function (node) {
  node.style.display = 'none';
};

var showNode = function (node) {
  node.style.display = '';
};

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
  var i;
  var array = [];

  for (i = 0; i < count; i++) {
    array[i] = i;
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

  for (i = 0; i < count; i++) {
    arrayTitels[array[i]] = OFFER_TITELS[i];
  }

  return arrayTitels;
};

//  Функция генерирует случайный массив строк со случайной длинной (features)
//  strArray (obj) - массив откуда выбирать
//  return features (string) - массив строк для Offer
var getRandomOfferFeatures = function () {
  var count = getRandomInt(1, OFFER_AVAILABLE_FEATURES.length + 1);
  var features = generateRandomArray(OFFER_AVAILABLE_FEATURES.length);
  var i;

  //  Обрезание массива по случайной длине
  features.length = count;
  for (i = 0; i < features.length; i++) {
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
  var i;
  var avatarNumbers = generateRandomArray(count);
  var offerTitels = generateTitelsArray(count);
  var arrayMapPins = [];

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
var createMapPinsNode = function (arrayMapPins) {
  var fragment = document.createDocumentFragment();
  var i;

  for (i = 0; i < arrayMapPins.length; i++) {
    fragment.appendChild(buildMapPinNode(arrayMapPins[i]));
  }

  return fragment;
};

//  Функция, путем удаления, убирает все недоступные 'удобства' из узла, которых нет в массиве (features)
//  node (object) - узел содержащий ВСЕ возможные удобства
//  features (object) - массив текущих удобств
var buildMapCardFeatures = function (node, features) {
  var i;

  for (i = 0; i < OFFER_AVAILABLE_FEATURES.length; i++) {
    if (features.indexOf(OFFER_AVAILABLE_FEATURES[i]) === -1) {
      node.removeChild(node.querySelector('.feature--' + OFFER_AVAILABLE_FEATURES[i]));
    }
  }
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
  mapCardNodeType.textContent = mapPin.offer.type;
  mapCardNodeRoomsGuests.textContent = mapPin.offer.rooms + ' комнаты для ' + mapPin.offer.guests + ' гостей';
  mapCardNodeCheckInOut.textContent = 'Заезд после ' + mapPin.offer.checkin + ', выезд до ' + mapPin.offer.checkout;
  buildMapCardFeatures(mapCardNodeFeatures, mapPin.offer.features);
  mapCardNodeDescription.textContent = mapPin.offer.description;

  return mapCardNode;
};

//  Функция создает элемент DIV с DOM элементами шаблона (template) 'article.map__card', согласно массиву объектов mapPins
//  mapPins (object) - массив объектов
//  return divNode (object) - вернуть собранный элемент DIV
var createMapCards = function (arrayMapPins) {
  var divNode = document.createElement('div');
  var i;

  divNode.className = 'map__cards';
  for (i = 0; i < arrayMapPins.length; i++) {
    divNode.appendChild(buildMapCard(arrayMapPins[i]));
  }

  return divNode;
};

var disableNoticeForm = function () {
  var i;

  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = true;
  }
};

var enableNoticeForm = function () {
  var i;

  noticeForm.classList.remove('notice__form--disabled');
  for (i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = false;
  }
};

var initInputsAttributes = function () {
  noticeFormTitleInput.required = true;
  noticeFormTitleInput.maxLength = TITLE_INPUT_MAX_LENGTH;

  noticeFormAddressInput.required = true;
  noticeFormAddressInput.readOnly = true;

  noticeFormPriceInput.required = true;
  noticeFormPriceInput.placeholder = PRICE_INPUT_PLACEHOLDER;
  noticeFormPriceInput.value = PRICE_INPUT_PLACEHOLDER;
  noticeFormPriceInput.max = PRICE_INPUT_MAX_VALUE;
};


var diactivatePinBase = function (node) {
  var offerIndex;

  //  Поиск индекса активной кнопки относительно массива всех сгенерированных кнопок
  //  Для определения соответствующей этой кнопке предложения
  node.classList.remove('map__pin--active');
  offerIndex = [].indexOf.call(mapGeneratedPins, node);
  hideNode(mapGeneratedCards[offerIndex]);
};

//  Ф-ции НАЖАТИЯ

var onMapEscPress = function (evt) {
  var mapPinActive = mapPinsNode.querySelector('.map__pin--active');
  if (evt.keyCode === ESC_KEYCODE && mapPinActive) {
    diactivatePinBase(mapPinActive);
  }
};

var onMapPinsNodeEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onMapPinsNodeClick(evt);
  }
};

var onMapCardsNodeEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onMapCardsNodeClick(evt);
  }
};

//  Ф-ции КЛИКИ

var onMapPinMainMouseUp = function () {
  mapNode.classList.remove('map--faded');
  mapGeneratedPins.forEach(showNode);
  initInputsAttributes();
  enableNoticeForm();
};

//  Делегирование на всплытии
var onMapPinsNodeClick = function (evt) {
  var target;
  var mapPinActive = mapPinsNode.querySelector('.map__pin--active');
  var offerIndex;

  // Переключить фокус, если необходимо. target - img, его родитель button
  if (evt.target.tagName === 'IMG') {
    target = evt.target.parentNode;
  } else {
    target = evt.target;
  }

  if (target.className === 'map__pin') {
    if (mapPinActive) {
      diactivatePinBase(mapPinActive);
    }

    target.classList.add('map__pin--active');
    offerIndex = [].indexOf.call(mapGeneratedPins, target);
    showNode(mapGeneratedCards[offerIndex]);

    document.addEventListener('keydown', onMapEscPress);
  }
};

//  Делегирование на всплытии
var onMapCardsNodeClick = function (evt) {
  var target = evt.target;
  var pinIndex;

  if (target.classList.contains('popup__close')) {
    hideNode(target.parentNode);
    pinIndex = [].indexOf.call(mapGeneratedCards, target.parentNode);
    mapGeneratedPins[pinIndex].classList.remove('map__pin--active');

    document.removeEventListener('keydown', onMapEscPress);
  }
};


disableNoticeForm();

//  Генерация и сборка узлов
mapPins = generateMapPins(MAP_PIN_COUNT);
mapPinsNode.appendChild(createMapPinsNode(mapPins));

//  Выбрать только сгенерированные кнопки (исключить главную кнопку из выборки)
mapGeneratedPins = mapPinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');
mapGeneratedPins.forEach(hideNode);

//  Генерация предложений
mapCardsNode = createMapCards(mapPins);
mapNode.insertBefore(mapCardsNode, mapFiltersContainerNode);
mapGeneratedCards = mapNode.querySelectorAll('.map__card');
mapGeneratedCards.forEach(hideNode);

//  ИНИЦИАЛИЗАЦИЯ Событий

mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);

mapPinsNode.addEventListener('click', onMapPinsNodeClick);
mapPinsNode.addEventListener('keydown', onMapPinsNodeEnterPress);

mapCardsNode.addEventListener('click', onMapCardsNodeClick);
mapCardsNode.addEventListener('keydown', onMapCardsNodeEnterPress);
