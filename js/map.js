'use strict';

//  map.js — модуль, который работает с картой. Использует вспомогательные модули:
//    card.js — модуль для отрисовки элемента на карточке
//    pin.js — модуль для отрисовки пина и взаимодействия с ним

(function () {
  //  Ограничитель кол-ва кнопок
  var MAP_PIN_MAX_LIMIT = 5;

  //  deltaY = 22(псевдоэлемент - указатель) + 62 / 2 (фактическая высота кнопки без псевдоэлемента) - 2 (translateY (-2px)) - 3
  //  картинка смещена относительно обертки, style.top применяется к обертке ==> необходимо учитывать translateY
  //  размер обертки кнопки = 65, размер кнопки без указателя = 62 ===> необходимо учитывать компенсацию = 3
  //  фактическая высота кнопки делится на два, так как еще смещена кнопка (translate (-50%, -50%)) ==> по X дельту можно не учитывать, но по Y необходимо!
  var MAP_PIN_MAIN_TOP_DELTA = 62 / 2 + 22 - 2 - 3;

  var MAP_PIN_MAIN_BORDER_X_MIN = 0;
  var MAP_PIN_MAIN_BORDER_X_MAX = 1200;
  var MAP_PIN_MAIN_BORDER_Y_MIN = 100;
  var MAP_PIN_MAIN_BORDER_Y_MAX = 500;

  var FILTER_PRICE_VALUES = {
    'any': {
      min: 0,
      max: Infinity
    },
    'middle': {
      min: 10001,
      max: 49999
    },
    'low': {
      min: 0,
      max: 10000
    },
    'high': {
      min: 50000,
      max: Infinity
    }
  };

  var mapNode = document.querySelector('.map');

  var mapFiltersContainerNode = mapNode.querySelector('.map__filters-container');
  var mapFiltersForm = mapFiltersContainerNode.querySelector('.map__filters');
  var mapFilterType = mapFiltersForm.querySelector('#housing-type');
  var mapFilterPrice = mapFiltersForm.querySelector('#housing-price');
  var mapFilterRooms = mapFiltersForm.querySelector('#housing-rooms');
  var mapFilterGuests = mapFiltersForm.querySelector('#housing-guests');
  var mapFilterFeatures = mapFiltersForm.querySelectorAll('#housing-features input');

  var mapPinsNode = mapNode.querySelector('.map__pins');
  var mapPinMain = mapPinsNode.querySelector('.map__pin--main');

  var mapPins;
  var mapCards;

  //  Сохраняем данные
  var mapPinsCards;

  var showNode = function (node) {
    node.style.display = '';
  };

  var renderMapPins = function (array) {
    var removeNode = function (node) {
      node.remove();
    };

    var mapCardsNode = document.querySelector('.map__cards');
    var fragment = document.createDocumentFragment();
    var count = MAP_PIN_MAX_LIMIT;
    var pin;
    var card;

    //  Убрать старое
    if (mapPins) {
      [].slice.call(mapPins).forEach(removeNode);
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
      pin = window.pin.buildMapPinNode(array[i], mapNode.clientHeight);
      pin.id = '$PINid$' + i;
      fragment.appendChild(pin);
    }
    mapPinsNode.appendChild(fragment);

    //  Выбираем все Кнопки, кроме главной
    mapPins = mapPinsNode.querySelectorAll('.map__pin:not(.map__pin--main)');

    //  Формируем DOM-ы Предложений
    mapCardsNode = document.createElement('div');
    mapCardsNode.className = 'map__cards';
    for (i = 0; i < count; i++) {
      card = window.card.buildMapCard(array[i]);
      card.setAttribute('data-pin', '$PINid$' + i);
      mapCardsNode.appendChild(card);
    }
    mapNode.insertBefore(mapCardsNode, mapFiltersContainerNode);

    //  Выбираем все предложения
    mapCards = mapCardsNode.querySelectorAll('.map__card');

    //  События должны срабатывать только после полного формирования DOM-ов
    [].slice.call(mapPins).forEach(window.pin.initializeMapPinEvent);
    [].slice.call(mapCards).forEach(window.card.initializeMapCardEvent);
  };

  var updatePinsCards = function () {
    var filterType = function (element) {
      return mapFilterType.value !== 'any' ? element.offer.type === mapFilterType.value : true;
    };
    var filterPrice = function (element) {
      if (element.offer.price >= FILTER_PRICE_VALUES[mapFilterPrice.value].min && element.offer.price <= FILTER_PRICE_VALUES[mapFilterPrice.value].max) {
        return true;
      } else {
        return false;
      }
    };
    var filterRooms = function (element) {
      return mapFilterRooms.value !== 'any' ? element.offer.rooms === +mapFilterRooms.value : true;
    };
    var filterGuests = function (element) {
      return mapFilterGuests.value !== 'any' ? element.offer.guests === +mapFilterGuests.value : true;
    };

    var features = [];
    var filteredMapPinsCards = mapPinsCards.slice(0);

    var collectFilterFeatures = function (element) {
      if (element.checked) {
        features.push(element.value);
      }
    };

    var filterFeatures = function (element) {
      var findEntry = function (feature) {
        return element.offer.features.indexOf(feature) !== window.utility.NOT_FOUND;
      };
      return features.every(findEntry);
    };

    //  Вывод ближайших к главной кнопке, если в массиве больше эл-ов, чем мы можем отобразить.
    var mapPinMainCoordsOnMap = {
      x: mapPinMain.offsetLeft,
      y: mapNode.offsetHeight - (mapPinMain.offsetTop + MAP_PIN_MAIN_TOP_DELTA)
    };

    var getDistance = function (element) {
      return Math.round(Math.sqrt(Math.pow(element.location.x - mapPinMainCoordsOnMap.x, 2) + Math.pow(element.location.y - mapPinMainCoordsOnMap.y, 2), 2));
    };

    var sortByDistance = function (left, right) {
      return getDistance(left) - getDistance(right);
    };

    [].slice.call(mapFilterFeatures).forEach(collectFilterFeatures);

    filteredMapPinsCards = filteredMapPinsCards.filter(filterType);
    filteredMapPinsCards = filteredMapPinsCards.filter(filterPrice);
    filteredMapPinsCards = filteredMapPinsCards.filter(filterRooms);
    filteredMapPinsCards = filteredMapPinsCards.filter(filterGuests);
    filteredMapPinsCards = filteredMapPinsCards.filter(filterFeatures);
    filteredMapPinsCards.sort(sortByDistance);

    renderMapPins(filteredMapPinsCards);
    [].slice.call(mapPins).forEach(showNode);
  };

  //  НАЖАТИЯ

  var onMapEscPress = function (evt) {
    if (evt.keyCode === window.utility.ESC_KEYCODE) {
      window.pin.disableActivePinOffer();
    }
  };

  //  КЛИКИ

  var onMapPinMainMouseUp = function () {
    mapNode.classList.remove('map--faded');
    window.utility.debounce(updatePinsCards);
    window.form.enableNoticeForm();
  };

  var onMapPinMainMouseDown = function (evt) {
    var onPinMainMouseMove = function (moveEvt) {
      //  Текущие координаты мышки
      var mouseMoveCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      //  Предполагаемое положение кнопки по Y
      var newTargetCoords = {
        x: mouseMoveCoords.x - mouseTargetPosition.x,
        y: mouseMoveCoords.y - mouseTargetPosition.y
      };

      //  Пересчитываем координаты относительно новой оси (левый нижний угол карты)
      //  Реверсируем ось Y
      var newTargetCoordsOnMap = {
        x: target.offsetLeft + newTargetCoords.x - targetCoords.x,
        y: mapNode.offsetHeight - (target.offsetTop + MAP_PIN_MAIN_TOP_DELTA + (newTargetCoords.y - targetCoords.y))
      };

      if (newTargetCoordsOnMap.x >= MAP_PIN_MAIN_BORDER_X_MIN && newTargetCoordsOnMap.x <= MAP_PIN_MAIN_BORDER_X_MAX && newTargetCoordsOnMap.y >= MAP_PIN_MAIN_BORDER_Y_MIN && newTargetCoordsOnMap.y <= MAP_PIN_MAIN_BORDER_Y_MAX) {
        target.style.left = (target.offsetLeft + (newTargetCoords.x - targetCoords.x)) + 'px';
        target.style.top = (target.offsetTop + (newTargetCoords.y - targetCoords.y)) + 'px';

        window.form.changeNoticeFormAddressInput(newTargetCoordsOnMap);

        //  Необходимо переопределить текущее положение кнопки, так как произошел сдвиг эл-та
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

    var target;
    var targetCoords;
    var mouseStartCoords;
    var mouseTargetPosition;
    var currentTargetCoordsOnMap;

    //  При первоначальном запуске страницы кнопку закрывает svg
    if (evt.target.parentNode.tagName === 'svg') {

      //  Переключить фокус на main pin button
      target = evt.target.parentNode.parentNode;
    } else {

      // После последующих вызовов, переключить фокус, если необходимо. target - img, его родитель button
      target = evt.target.tagName === 'IMG' ? evt.target.parentNode : evt.target;
    }

    //  Координаты кнопки в нулевой момент
    targetCoords = {
      x: target.getBoundingClientRect().left,
      y: target.getBoundingClientRect().top
    };

    //  Координаты мышки в нулевой момент
    mouseStartCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    //  Положение мыши относительно кнопки в нулевой момент,
    //  величина постоянная до отжатия кнопки мышки
    mouseTargetPosition = {
      x: mouseStartCoords.x - targetCoords.x,
      y: mouseStartCoords.y - targetCoords.y
    };

    //  Вывод положения мыши в форму не дожидаясь перемещения, так как перемещения может и не произойти!
    currentTargetCoordsOnMap = {
      x: target.offsetLeft,
      y: mapNode.offsetHeight - (target.offsetTop + MAP_PIN_MAIN_TOP_DELTA)
    };

    window.form.changeNoticeFormAddressInput(currentTargetCoordsOnMap);

    evt.preventDefault();
    document.addEventListener('mousemove', onPinMainMouseMove);
    document.addEventListener('mouseup', onPinMainMouseUp);
  };

  //  Коллбек-фция при успешной загрузке
  var onMapPinLoad = function (arrayMapPins) {
    mapPinsCards = arrayMapPins;
    renderMapPins(mapPinsCards);
  };

  //  Коллбек-фция при неудачной загрузке
  var onMapPinError = function (errorType) {
    window.utility.onDefaultError(errorType, 'default', function (node, message) {
      node.style.bottom = 0;
      node.textContent = 'Во время загрузки данных возникли проблемы. ' + message;
    });
  };

  var onMapFiltersFormChange = function () {
    window.utility.debounce(updatePinsCards);
  };

  //  Инициализация и сборка узлов
  window.backend.load(onMapPinLoad, onMapPinError);

  mapFiltersForm.addEventListener('change', onMapFiltersFormChange);

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);

  window.map = {
    onMapEscPress: onMapEscPress,
  };
})();
