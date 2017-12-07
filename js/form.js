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

  var priceInputMin = PRICE_INPUT_MIN_DEFAULT;

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

  var changeNoticeFormAddressInput = function (coords) {
    noticeFormAddressInput.value = 'x: {' + coords.x + '}, y: {' + coords.y + '}';
  };

  var onNoticeFormTimeInSelectChange = function () {
    noticeFormTimeOutSelect.value = noticeFormTimeInSelect.value;
  };

  var onNoticeFormTimeOutSelectChange = function () {
    noticeFormTimeInSelect.value = noticeFormTimeOutSelect.value;
  };

  var onNoticeFormRoomstSelectChange = function () {

    //  Несостыковка значений value у разных селекторов
    if (noticeFormRoomstSelect.value === '100') {
      noticeFormCapacitySelect.value = 0;
    } else {
      noticeFormCapacitySelect.value = noticeFormRoomstSelect.value;
    }
  };

  var onNoticeFormTypeSelectChange = function (evt) {
    var selectedValue = evt.target.value;

    priceInputMin = PRICE_INPUT_MIN_TYPES[selectedValue];
  };

  var onNoticeFormPriceInputInvalid = function (evt) {
    var target = evt.target;

    if (target.value < priceInputMin) {
      target.setCustomValidity('Минимальная цена = ' + priceInputMin);
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

  disableNoticeForm();
  initInputsSelectsAttributes();

  noticeFormTimeInSelect.addEventListener('change', onNoticeFormTimeInSelectChange);
  noticeFormTimeOutSelect.addEventListener('change', onNoticeFormTimeOutSelectChange);
  noticeFormTypeSelect.addEventListener('change', onNoticeFormTypeSelectChange);
  noticeFormRoomstSelect.addEventListener('change', onNoticeFormRoomstSelectChange);

  noticeFormPriceInput.addEventListener('invalid', onNoticeFormPriceInputInvalid);
  noticeFormTitleInput.addEventListener('invalid', onNoticeFormTitleInputInvalid);

  window.form = {
    enableNoticeForm: enableNoticeForm,
    changeNoticeFormAddressInput: changeNoticeFormAddressInput
  };
})();
