'use strict';

(function () {
  window.synchronizeFields = function (sourseElement, targetElement, sourseData, targetData, callback) {
    sourseElement.addEventListener('change', function () {
      var index = sourseData.indexOf(sourseElement.value);
      callback(targetElement, targetData[index]);
    });
  };
})();
