'use strict';

//  map.js — модуль, который работает с картой. Использует вспомогательные модули:
//    card.js — модуль для отрисовки элемента на карточке
//    pin.js — модуль для отрисовки пина и взаимодействия с ним

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  //  Учитывая псевдоэлемент
  var MAP_PIN_MAIN_HEIGTH = 80;

  var MAP_PIN_MAIN_BORDER_X_MIN = 300;
  var MAP_PIN_MAIN_BORDER_X_MAX = 900;
  var MAP_PIN_MAIN_BORDER_Y_MIN = 100;
  var MAP_PIN_MAIN_BORDER_Y_MAX = 500;

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
  var onLoad = function (arrayMapPins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arrayMapPins.length; i++) {
      fragment.appendChild(window.pin.buildMapPinNode(arrayMapPins[i], mapNode.clientHeight));
    }

    mapPinsNode.appendChild(fragment);
    mapGeneratedPins = mapPinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapGeneratedPins.forEach(hideNode);

    var mapCardsNode = document.createElement('div');

    mapCardsNode.className = 'map__cards';
    for (var i = 0; i < arrayMapPins.length; i++) {
      mapCardsNode.appendChild(window.card.buildMapCard(arrayMapPins[i]));
    }

    mapNode.insertBefore(mapCardsNode, mapFiltersContainerNode);
    mapGeneratedCards = mapCardsNode.childNodes;
    mapGeneratedCards.forEach(hideNode);

    mapPinsNode.addEventListener('click', onMapPinsNodeClick);
    mapPinsNode.addEventListener('keydown', onMapPinsNodeEnterPress);

    mapCardsNode.addEventListener('click', onMapCardsNodeClick);
    mapCardsNode.addEventListener('keydown', onMapCardsNodeEnterPress);

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

  var onMapPinMainMouseDown = function (evt) {
    evt.preventDefault();

    // Переключить фокус, если необходимо. target - img, его родитель button
    var target = evt.target.tagName === 'IMG' ? evt.target.parentNode : evt.target;

    //  Координаты кнопки в нулевой момент
    var targetCoords = {
      x: target.getBoundingClientRect().left,
      y: target.getBoundingClientRect().top
    };

    //  Координаты мышки в нулевой момент
    var mouseStartCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    //  Положение мыши относительно кнопки в нулевой момент,
    //  величина постоянная до отжатия кнопки мышки
    var mouseTargetPosition = {
      x: mouseStartCoords.x - targetCoords.x,
      y: mouseStartCoords.y - targetCoords.y
    };

    var onPinMainMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      //  Текущие координаты мышки
      var mouseMoveCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      //  Предпологаемое положение кнопки по Y
      var newTargetCoords = {
        x: mouseMoveCoords.x - mouseTargetPosition.x,
        y: mouseMoveCoords.y - mouseTargetPosition.y
      };

      //  Пересчитываем координаты относительно новой оси (левый нижний угол карты)
      //  Реверсируем ось Y
      var newTargetCoordsOnMap = {
        y: mapNode.clientHeight - MAP_PIN_MAIN_HEIGTH - newTargetCoords.y - pageYOffset,
        x: newTargetCoords.x - mapNode.clientLeft - pageXOffset
      };

      if (newTargetCoordsOnMap.x >= MAP_PIN_MAIN_BORDER_X_MIN && newTargetCoordsOnMap.x <= MAP_PIN_MAIN_BORDER_X_MAX && newTargetCoordsOnMap.y >= MAP_PIN_MAIN_BORDER_Y_MIN && newTargetCoordsOnMap.y <= MAP_PIN_MAIN_BORDER_Y_MAX) {
        target.style.left = (target.offsetLeft + (newTargetCoords.x - targetCoords.x)) + 'px';
        target.style.top = (target.offsetTop + (newTargetCoords.y - targetCoords.y)) + 'px';

        window.form.changeNoticeFormAddressInput(newTargetCoordsOnMap);

        //  Неопходимо переопределить текущее положение кнопки, так как произашел сдвиг эл-та
        targetCoords = {
          x: target.getBoundingClientRect().left,
          y: target.getBoundingClientRect().top
        };
      }
    };

    var onPinMainMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMainMouseMove);
      document.removeEventListener('mouseup', onPinMainMouseUp);
    };

    document.addEventListener('mousemove', onPinMainMouseMove);
    document.addEventListener('mouseup', onPinMainMouseUp);
  };

  //  Делегирование на всплытии
  var onMapPinsNodeClick = function (evt) {
    // Переключить фокус, если необходимо. target - img, его родитель button
    var target = evt.target.tagName === 'IMG' ? evt.target.parentNode : evt.target;
    var mapPinActive = mapPinsNode.querySelector('.map__pin--active');

    if (target.className === 'map__pin') {
      if (mapPinActive) {
        diactivatePinBase(mapPinActive);
      }

      target.classList.add('map__pin--active');

      window.showCard(target, mapGeneratedPins);

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
  window.backend.load(onLoad, null);

  //  ИНИЦИАЛИЗАЦИЯ Событий

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);
})();
