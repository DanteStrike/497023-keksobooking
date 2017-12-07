'use strict';

//  map.js — модуль, который работает с картой. Использует вспомогательные модули:
//    card.js — модуль для отрисовки элемента на карточке
//    pin.js — модуль для отрисовки пина и взаимодействия с ним

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var MAP_PIN_Y_DELTA = 40;
  var MAP_PIN_X_DELTA = 5;

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

    //  Сдвиг координат мужде мышкой и кнопкой (положение мыши относительно кнопки в нулевой момент),
    //  величина постоянная до отжатия кнопки мышки
    var mouseTargetPosition = {
      x: mouseStartCoords.x - targetCoords.x,
      y: mouseStartCoords.y - targetCoords.y
    };

    var onPinMainMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var locationCoords;
      //  Текущие координаты мышки
      var mouseMoveCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      //  Положение мыши относительно кнопки ПО Y в момент пермещения
      var mouseTargetPositionY = mouseMoveCoords.y - mouseTargetPosition.y;

      //  Граница доступной области пермещения по Y
      //  Реверсируем ось Y
      var borderY = mapNode.clientHeight - MAP_PIN_Y_DELTA - mouseTargetPositionY - pageYOffset;

      if (borderY >= 100 && borderY <= 500) {
        target.style.left = (target.offsetLeft + (mouseMoveCoords.x - mouseTargetPosition.x - targetCoords.x)) + 'px';
        target.style.top = (target.offsetTop + (mouseTargetPositionY - targetCoords.y)) + 'px';

        locationCoords = {
          x: parseInt(target.style.left) - MAP_PIN_X_DELTA - pageXOffset,
          y: mapNode.clientHeight - MAP_PIN_Y_DELTA - mouseTargetPositionY - pageYOffset
        }

        window.form.changeNoticeFormAddressInput(locationCoords);
        //  Неопходимо переопределить текущее положение кнопки, так произащел сдвиг эл-та
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

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);

  mapPinsNode.addEventListener('click', onMapPinsNodeClick);
  mapPinsNode.addEventListener('keydown', onMapPinsNodeEnterPress);

  mapCardsNode.addEventListener('click', onMapCardsNodeClick);
  mapCardsNode.addEventListener('keydown', onMapCardsNodeEnterPress);
})();
