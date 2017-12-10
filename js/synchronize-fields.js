'use strict';

(function () {
  window.synchronizeFields = function (sourseElement, targetElement, sourseData, targetData, collback) {
    sourseElement.addEventListener('change', function () {
      var index = sourseData.indexOf(sourseElement.value);
      collback(targetElement, targetData[index]);
    });
  }
})();
