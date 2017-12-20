'use strict';

(function () {
  var LIVE_TIME_ERROR_MESSAGE = 1500;
  var DEBOUNCE_INTERVAL = 500; // ms

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var NOT_FOUND = -1;

  //  Форма ошибок схожа для формы и для карты, но имеет отличия в стилизации
  //  Вынесена в отдельный модуль с гибкой настройкой callback-ом
  var onDefaultError = function (errorMessage, messageLifetime, callback) {
    //  Убираем сообщение через указанный интервал времени
    var removeErrorMessage = function () {
      var currentNodeError = document.querySelector('.ErrorMessage');

      if (currentNodeError) {
        currentNodeError.parentNode.removeChild(currentNodeError);
      }
    };

    var nodeError = document.createElement('div');

    if (!messageLifetime || messageLifetime === 'default') {
      messageLifetime = LIVE_TIME_ERROR_MESSAGE;
    }

    nodeError.classList.add('ErrorMessage');

    //  Дефолтные настройки
    nodeError.style.position = 'fixed';
    nodeError.style.zIndex = '100';
    nodeError.style.left = 0;
    nodeError.style.right = 0;
    nodeError.style.margin = '0 auto';
    nodeError.style.textAlign = 'center';
    nodeError.style.fontSize = '20px';
    nodeError.style.backgroundColor = 'red';
    nodeError.textContent = errorMessage;

    //  Гибкая кастомизация сообщения ошибки
    if (typeof callback === 'function') {
      callback(nodeError, errorMessage);
    }

    document.body.insertAdjacentElement('afterbegin', nodeError);

    setTimeout(removeErrorMessage, messageLifetime);
  };

  var lastTimeout;
  var debounce = function (func) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
  };

  window.utility = {
    onDefaultError: onDefaultError,
    debounce: debounce,
    enterKeyCode: ENTER_KEYCODE,
    escKeyCode: ESC_KEYCODE,
    notFound: NOT_FOUND
  };
})();
