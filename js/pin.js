'use strict';

(function () {
  //  смещение координат кнопки с левого верхнего угла в левый нижний
  //  dх = х + 5
  //  dy = MAX_H - y - 40
  var MAP_PIN_X_DELTA = 5;
  var MAP_PIN_Y_DELTA = 40;

  var buildMapPinNode = function (mapPin, mapHeight) {
    var mapPinNode = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
    var mapPinNodeAvatar = mapPinNode.querySelector('img');

    mapPinNode.style.left = (mapPin.location.x - MAP_PIN_X_DELTA) + 'px';

    // mapHeight высота рабочей области карты, нужна для пересчета координат с верхнего угла в нижний
    mapPinNode.style.top = (mapHeight - mapPin.location.y - MAP_PIN_Y_DELTA) + 'px';
    mapPinNode.style.display = 'none';

    mapPinNodeAvatar.src = mapPin.author.avatar;

    return mapPinNode;
  };

  var disableActivePinOffer = function () {
    var mapPinActive = document.querySelector('.map__pin--active');
    if (mapPinActive) {
      mapPinActive.classList.remove('map__pin--active');
      window.card.hideCard(mapPinActive.id);
    }
  };

  var onMapPinClick = function (evt) {
    // Переключить фокус, если необходимо. target - img, его родитель button
    var target = evt.target.tagName === 'IMG' ? evt.target.parentNode : evt.target;

    disableActivePinOffer();
    target.classList.add('map__pin--active');
    window.showCard(target.id);
    document.addEventListener('keydown', window.map.onMapEscPress);
  };

  var onMapPinEnterPress = function (evt) {
    if (evt.keyCode === window.map.enterKeyCode) {
      onMapPinClick(evt);
    }
  };

  var initializeMapPinEvent = function (mapPinNode) {
    mapPinNode.addEventListener('click', onMapPinClick);
    mapPinNode.addEventListener('keydown', onMapPinEnterPress);
  };

  window.pin = {
    disableActivePinOffer: disableActivePinOffer,
    buildMapPinNode: buildMapPinNode,
    initializeMapPinEvent: initializeMapPinEvent
  };
})();

