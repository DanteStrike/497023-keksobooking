'use strict';

(function () {
  window.showCard = function (target, targets) {
    var mapCards = document.querySelectorAll('.map__card');
    var offerIndex = [].indexOf.call(targets, target);
    mapCards[offerIndex].style.display = '';
  };
})();
