'use strict';

(function () {
  window.show_card = {
    showCard: function (target, targets) {
      var mapGeneratedCards = document.querySelectorAll('.map__card');
      var offerIndex = [].indexOf.call(targets, target);
      mapGeneratedCards[offerIndex].style.display = '';
    }
  };
})();
