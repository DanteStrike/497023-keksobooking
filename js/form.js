'use strict';

//  form.js — модуль, который работает с формой объявления

(function () {
  var TITLE_INPUT_MIN_LENGTH = 30;
  var TITLE_INPUT_MAX_LENGTH = 100;

  var PRICE_INPUT_MIN_DEFAULT = 0;
  var PRICE_INPUT_MAX_VALUE = 1000000;
  var PRICE_INPUT_MIN_TYPES = {
    'flat': 0,
    'bungalo': 1000,
    'house': 5000,
    'palace': 1000000
  };

  var ROOM_TYPES = ['flat', 'bungalo', 'house', 'palace'];

  var TIMES_IN = ['12:00', '13:00', '14:00'];
  var TIMES_OUT = ['12:00', '13:00', '14:00'];

  var ROOMS = ['1', '2', '3', '100'];
  var CAPACITY = ['1', '2', '3', '0'];

  var noticeForm = document.querySelector('.notice__form');
  var noticeFormTitleInput = noticeForm.querySelector('#title');
  var noticeFormAddressInput = noticeForm.querySelector('#address');
  var noticeFormPriceInput = noticeForm.querySelector('#price');
  var noticeFormTimeInSelect = noticeForm.querySelector('#timein');
  var noticeFormTimeOutSelect = noticeForm.querySelector('#timeout');
  var noticeFormTypeSelect = noticeForm.querySelector('#type');
  var noticeFormRoomstSelect = noticeForm.querySelector('#room_number');
  var noticeFormCapacitySelect = noticeForm.querySelector('#capacity');

  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');

  var onNoticeFormPriceInputInvalid = function (evt) {
    var target = evt.target;

    if (target.validity.rangeUnderflow) {
      target.setCustomValidity('Минимальная цена = ' + target.min);
    } else {
      target.setCustomValidity('');
    }
  };

  var onNoticeFormTitleInputInvalid = function (evt) {
    //  браузер Edge не поддерживает атрибут minlength
    var target = evt.target;

    if (target.value.length < TITLE_INPUT_MIN_LENGTH) {
      target.setCustomValidity('Имя должно состоять минимум из ' + TITLE_INPUT_MIN_LENGTH + ' символов');
    } else if (noticeFormTitleInput.validity.tooLong) {
      noticeFormTitleInput.setCustomValidity('Имя не должно превышать ' + TITLE_INPUT_MAX_LENGTH + ' символов');
    } else if (noticeFormTitleInput.validity.valueMissing) {
      noticeFormTitleInput.setCustomValidity('Обязательное поле');
    } else {
      noticeFormTitleInput.setCustomValidity('');
    }
  };

  var disableNoticeForm = function () {
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = true;
    }
  };

  var enableNoticeForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = false;
    }
  };

  var initInputsSelectsAttributes = function () {
    // Изначально данных атт нет в разметке
    noticeFormTitleInput.required = true;
    noticeFormTitleInput.maxLength = TITLE_INPUT_MAX_LENGTH;

    noticeFormAddressInput.required = true;
    noticeFormAddressInput.readOnly = true;

    noticeFormPriceInput.required = true;
    noticeFormPriceInput.min = PRICE_INPUT_MIN_DEFAULT;
    noticeFormPriceInput.max = PRICE_INPUT_MAX_VALUE;

    //  Количество комнат связано с количеством гостей
    noticeFormCapacitySelect.value = noticeFormRoomstSelect.value;
  };

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var changeNoticeFormAddressInput = function (coords) {
    noticeFormAddressInput.value = 'x: {' + coords.x + '}, y: {' + coords.y + '}';
  };

  //  Коллбек-фция при успешной отправке
  var onNoticeFormLoad = function () {
    noticeForm.reset();
  };

  //  Стираем временное сообщение
  var removeErrorMessage = function () {
    var currentNodeError = document.querySelector('.ErrorMessage');

    if (currentNodeError) {
      currentNodeError.parentNode.removeChild(currentNodeError);
    }
  };

  //  Коллбек-фция при неудачной отправке
  var onNoticeFormError = function (errorType) {
    var nodeError = document.createElement('div');
    window.data.onDefaultError(errorType, 'default', function (node, message) {
      node.style.top = 0;
      node.style.backgroundColor = 'orange';
      node.textContent = 'Во время работы с формой возникли проблемы. ' + message;
    });
  };

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(noticeForm), onNoticeFormLoad, onNoticeFormError);
    evt.preventDefault();
  });

  disableNoticeForm();
  initInputsSelectsAttributes();

  window.synchronizeFields(noticeFormTimeInSelect, noticeFormTimeOutSelect, TIMES_IN, TIMES_OUT, syncValues);
  window.synchronizeFields(noticeFormTimeOutSelect, noticeFormTimeInSelect, TIMES_OUT, TIMES_IN, syncValues);

  window.synchronizeFields(noticeFormTypeSelect, noticeFormPriceInput, ROOM_TYPES, PRICE_INPUT_MIN_TYPES, syncValueWithMin);
  window.synchronizeFields(noticeFormRoomstSelect, noticeFormCapacitySelect, ROOMS, CAPACITY, syncValues);

  noticeFormPriceInput.addEventListener('invalid', onNoticeFormPriceInputInvalid);
  noticeFormTitleInput.addEventListener('invalid', onNoticeFormTitleInputInvalid);

  window.form = {
    enableNoticeForm: enableNoticeForm,
    changeNoticeFormAddressInput: changeNoticeFormAddressInput
  };
})();
