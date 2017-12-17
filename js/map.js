'use strict';

//  map.js — модуль, который работает с картой. Использует вспомогательные модули:
//    card.js — модуль для отрисовки элемента на карточке
//    pin.js — модуль для отрисовки пина и взаимодействия с ним

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  //  Ограничитель кол-ва кнопок
  var MAP_PIN_MAX_LIMIT = 10;

  //  Учитывая псевдоэлемент
  var MAP_PIN_MAIN_WIDTH = 80;
  var MAP_PIN_MAIN_HEIGTH = 80;

  var MAP_PIN_MAIN_BORDER_X_MIN = 0;
  var MAP_PIN_MAIN_BORDER_X_MAX = 1200;
  var MAP_PIN_MAIN_BORDER_Y_MIN = 100;
  var MAP_PIN_MAIN_BORDER_Y_MAX = 500;

  var mapNode = document.querySelector('.map');

  var mapFiltersContainerNode = mapNode.querySelector('.map__filters-container');
  var mapFiltersForm = mapFiltersContainerNode.querySelector('.map__filters')
  var mapPinsNode = mapNode.querySelector('.map__pins');
  var mapPinMain = mapPinsNode.querySelector('.map__pin--main');

  var mapPins;
  var mapCards;

  //  Сохраняем данные
  var mapPinsCards;

  //  НАЖАТИЯ

  var onMapEscPress = function (evt) {
    var mapPinActive = mapPinsNode.querySelector('.map__pin--active');
    if (evt.keyCode === ESC_KEYCODE && window.pin.disablePin()) {
      window.card.hideCard(mapPinActive, mapPins)
    }
  };

  //  КЛИКИ

  var onMapPinMainMouseUp = function () {
    var showNode = function (node) {
      node.style.display = '';
    };

    mapNode.classList.remove('map--faded');
    mapPins.forEach(showNode);
    window.form.enableNoticeForm();
  };

  var onMapPinMainMouseDown = function (evt) {
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

    //  Вывод положения мыши в форму не дожидаясь перемещения, так как перемещения может и не произайти!
    var currentTargetCoordsOnMap = {
      y: mapNode.clientHeight - MAP_PIN_MAIN_HEIGTH - targetCoords.y - pageYOffset - 0.5,
      x: targetCoords.x - MAP_PIN_MAIN_WIDTH / 2 - mapNode.clientLeft - pageXOffset
    };

    window.form.changeNoticeFormAddressInput(currentTargetCoordsOnMap);

    var onPinMainMouseMove = function (moveEvt) {
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
        y: mapNode.clientHeight - MAP_PIN_MAIN_HEIGTH - newTargetCoords.y - pageYOffset - 0.5,
        x: newTargetCoords.x - MAP_PIN_MAIN_WIDTH / 2 - mapNode.clientLeft - pageXOffset
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
      moveEvt.preventDefault();
    };

    var onPinMainMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onPinMainMouseMove);
      document.removeEventListener('mouseup', onPinMainMouseUp);
    };

    evt.preventDefault();
    document.addEventListener('mousemove', onPinMainMouseMove);
    document.addEventListener('mouseup', onPinMainMouseUp);
  };

  //  Коллбек-фция при успешной загрузке
  var onMapPinLoad = function (arrayMapPins) {
    mapPinsCards = arrayMapPins;
    renderMapPin(mapPinsCards);
  };

  //  Коллбек-фция при неудачной загрузке
  var onMapPinError = function (errorType) {
    window.data.onDefaultError(errorType, 'default', function (node, message) {
      node.style.bottom = 0;
      node.textContent = 'Во время загрузки данных возникли проблемы. ' + message;
    });
  };

  var renderMapPin = function (array) {
    var removeNode = function (node) {
      node.remove();
    }

    var mapCardsNode = document.querySelector('map__cards');
    var fragment = document.createDocumentFragment();
    var count = MAP_PIN_MAX_LIMIT;

    //  Убрать старое
    if (mapPins) {
      mapPins.forEach(removeNode);
    }

    if (mapCardsNode) {
      removeNode(mapCardsNode);
    }

    //  Сформировать новое
    if (count > array.length) {
      count = array.length;
    }
    //  Формируем DOM-ы Кнопок на карте
    for (var i = 0; i < count; i++) {
      fragment.appendChild(window.pin.buildMapPinNode(array[i], mapNode.clientHeight));
    }
    mapPinsNode.appendChild(fragment);

    //  Выбираем все Кнопки, кроме главной
    mapPins = mapPinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');

    //  Формируем DOM-ы Предложений
    mapCardsNode = document.createElement('div');
    mapCardsNode.className = 'map__cards';
    for (i = 0; i < count; i++) {
      mapCardsNode.appendChild(window.card.buildMapCard(array[i]));
    }
    mapNode.insertBefore(mapCardsNode, mapFiltersContainerNode);

    //  Выбираем все предложения
    mapCards = mapCardsNode.querySelectorAll('.map__card');

    //  События должны срабатывать только после полного формирования DOM-ов
    mapPins.forEach(window.pin.initializeMapPinEvent);
    mapCards.forEach(window.card.initializeMapCardEvent);
  };

  //  Инициализация и сборка узлов
  window.backend.load(onMapPinLoad, onMapPinError);

  var onMapFiltersFormChange = function () {

  };

  mapFiltersForm.addEventListener('change', onMapFiltersFormChange);

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);

  window.map = {
    onMapEscPress: onMapEscPress,
    enterKeyCode: ENTER_KEYCODE,
    escKeycode: ESC_KEYCODE
  };
})();
