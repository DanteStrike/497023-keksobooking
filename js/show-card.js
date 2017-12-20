'use strict';

(function () {
  window.showCard = function (pinId) {
    var card = document.querySelector('[data-pin=\"' + pinId + '\"]');
    card.style.display = '';
  };
})();
