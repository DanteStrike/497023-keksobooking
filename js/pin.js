'use strict';

(function () {
  //  смещение координат кнопки с левого верхнего угла в левый нижний
  //  dх = х + 5
  //  dy = MAX_H - y - 40
  var MAP_PIN_X_DELTA = 5;
  var MAP_PIN_Y_DELTA = 40;

  window.pin = {
    buildMapPinNode: function (mapPin, mapHeight) {
      var mapPinNode = document.querySelector('template').content.querySelector('.map__pin').cloneNode(true);
      var mapPinNodeAvatar = mapPinNode.querySelector('img');

      mapPinNode.style.left = (mapPin.location.x - MAP_PIN_X_DELTA) + 'px';

      // mapHeight высота рабочей области карты, нужна для пересчета координат с верхнего угла в нижний
      mapPinNode.style.top = (mapHeight - mapPin.location.y - MAP_PIN_Y_DELTA) + 'px';
      mapPinNodeAvatar.src = mapPin.author.avatar;

      return mapPinNode;
    }
  };
})();

