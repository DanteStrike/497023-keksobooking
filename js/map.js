'use strict';

//  map.js — модуль, который работает с картой. Использует вспомогательные модули:
//    card.js — модуль для отрисовки элемента на карточке
//    pin.js — модуль для отрисовки пина и взаимодействия с ним

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var mapNode = document.querySelector('.map');
  var mapFiltersContainerNode = mapNode.querySelector('.map__filters-container');
  var mapPinsNode = mapNode.querySelector('.map__pins');
  var mapPinMain = mapPinsNode.querySelector('.map__pin--main');
  var mapGeneratedPins;
  var mapGeneratedCards;
  var mapCardsNode;

  //  Переключатели видимости узла
  var hideNode = function (node) {
    node.style.display = 'none';
  };

  var showNode = function (node) {
    node.style.display = '';
  };

  //  Функция создает фрагмент с DOM элементами шаблона (template) '.map__pin', согласно массиву объектов mapPins
  //  mapPins (object) - массив объектов
  //  return fragment (object) - вернуть собранный фрагмент
  var createMapPinsNode = function (arrayMapPins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arrayMapPins.length; i++) {
      fragment.appendChild(window.pin.buildMapPinNode(arrayMapPins[i], mapNode.clientHeight));
    }

    return fragment;
  };

  //  Функция создает элемент DIV с DOM элементами шаблона (template) 'article.map__card', согласно массиву объектов mapPins
  //  mapPins (object) - массив объектов
  //  return divNode (object) - вернуть собранный элемент DIV
  var createMapCards = function (arrayMapPins) {
    var divNode = document.createElement('div');

    divNode.className = 'map__cards';
    for (var i = 0; i < arrayMapPins.length; i++) {
      divNode.appendChild(window.card.buildMapCard(arrayMapPins[i]));
    }

    return divNode;
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
    window.form.enableNoticeForm();
  };

  //  Делегирование на всплытии
  var onMapPinsNodeClick = function (evt) {
    // Переключить фокус, если необходимо. target - img, его родитель button
    var target = evt.target.tagName === 'IMG' ? evt.target.parentNode : evt.target;
    var mapPinActive = mapPinsNode.querySelector('.map__pin--active');
    var offerIndex;

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

  //  Генерация и сборка узлов
  mapPinsNode.appendChild(createMapPinsNode(window.data.mapPin));

  //  Выбрать только сгенерированные кнопки (исключить главную кнопку из выборки)
  mapGeneratedPins = mapPinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');
  mapGeneratedPins.forEach(hideNode);

  //  Генерация предложений
  mapCardsNode = createMapCards(window.data.mapPin);
  mapNode.insertBefore(mapCardsNode, mapFiltersContainerNode);
  mapGeneratedCards = mapNode.querySelectorAll('.map__card');
  mapGeneratedCards.forEach(hideNode);

  //  ИНИЦИАЛИЗАЦИЯ Событий

  mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);

  mapPinsNode.addEventListener('click', onMapPinsNodeClick);
  mapPinsNode.addEventListener('keydown', onMapPinsNodeEnterPress);

  mapCardsNode.addEventListener('click', onMapCardsNodeClick);
  mapCardsNode.addEventListener('keydown', onMapCardsNodeEnterPress);
})();
