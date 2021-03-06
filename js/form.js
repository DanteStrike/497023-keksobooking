'use strict';

//  form.js — модуль, который работает с формой объявления

(function () {
  var TITLE_INPUT_MIN_LENGTH = 30;
  var TITLE_INPUT_MAX_LENGTH = 100;

  var PRICE_INPUT_MIN_DEFAULT = 0;
  var PRICE_INPUT_MAX_VALUE = 1000000;
  var PRICE_INPUT_MIN_TYPES = [0, 1000, 5000, 1000000];

  var ROOM_TYPES = ['flat', 'bungalo', 'house', 'palace'];

  var TIMES_IN = ['12:00', '13:00', '14:00'];
  var TIMES_OUT = ['12:00', '13:00', '14:00'];

  var ROOMS = ['1', '2', '3', '100'];
  var CAPACITY = [['1'], ['1', '2'], ['1', '2', '3'], '0'];

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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

  var noticeFormAvatarPreview = noticeForm.querySelector('.notice__preview img');
  var noticeFormAvatarInput = noticeForm.querySelector('.notice__photo #avatar');

  var noticeFormPhotosContainer = noticeForm.querySelector('.form__photo-container');
  var noticeFormPhotoUpLoad = noticeFormPhotosContainer.querySelector('.upload');
  var noticeFormPhotoInput = noticeFormPhotoUpLoad.querySelector('#images');

  var onNoticeFormTitleInputInvalid = function (evt) {
    var target = evt.target;

    if (target.value.length < TITLE_INPUT_MIN_LENGTH) {
      target.setCustomValidity('Имя должно состоять минимум из ' + TITLE_INPUT_MIN_LENGTH + ' символов');
    } else if (target.validity.tooLong) {
      target.setCustomValidity('Имя не должно превышать ' + TITLE_INPUT_MAX_LENGTH + ' символов');
    } else if (target.validity.valueMissing) {
      target.setCustomValidity('Обязательное поле');
    } else {
      target.setCustomValidity('');
    }
  };

  var onNoticeFormTitleInputInput = function (evt) {
    var target = evt.target;

    //  браузер Edge не поддерживает атрибут minlength
    if (target.value.length < TITLE_INPUT_MIN_LENGTH) {
      target.setCustomValidity('Имя должно состоять минимум из ' + TITLE_INPUT_MIN_LENGTH + ' символов');
    } else {
      target.setCustomValidity('');
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

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
    element.placeholder = element.min;
  };

  var syncValueWithOptions = function (element, values) {
    var elementDomOptions = [].slice.call(element.children);
    var disableIncorrectOptions = function (option) {
      if (values.includes(option.value)) {
        option.disabled = false;
      } else {
        option.disabled = true;
      }
    };

    elementDomOptions.forEach(disableIncorrectOptions);
    //  Перекинуть на доступную опцию
    element.value = values[0];
  };

  var initInputsSelectsAttributes = function () {
    // Изначально данных атт нет в разметке
    noticeFormTitleInput.required = true;
    noticeFormTitleInput.maxLength = TITLE_INPUT_MAX_LENGTH;
    noticeFormTitleInput.minLength = TITLE_INPUT_MIN_LENGTH;

    noticeFormAddressInput.required = true;

    noticeFormPriceInput.required = true;
    noticeFormPriceInput.min = PRICE_INPUT_MIN_DEFAULT;
    noticeFormPriceInput.placeholder = noticeFormPriceInput.min;
    noticeFormPriceInput.max = PRICE_INPUT_MAX_VALUE;

    noticeFormCapacitySelect.required = true;

    //  Начальная синхронизация кол-ва гостей
    noticeFormCapacitySelect.options[0].removeAttribute('selected');
    noticeFormCapacitySelect.options[2].setAttribute('selected', '');
    syncValueWithOptions(noticeFormCapacitySelect, CAPACITY[0]);
  };

  //  Обработка загруженной фотографии, регулируется callback - onReaderLoad
  var processUploadedFile = function (inputFileNode, onReaderLoad) {
    var file = inputFileNode.files[0];
    var fileName = file.name.toLowerCase();

    var checkFileType = function (type) {
      return fileName.endsWith(type);
    };

    var matches = FILE_TYPES.some(checkFileType);

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', onReaderLoad);
      reader.readAsDataURL(file);
    }
  };

  var onNoticeFormAvatarInputChange = function () {
    var onReaderAvatarLoad = function (evtReader) {
      var reader = evtReader.target;
      noticeFormAvatarPreview.src = reader.result;
    };

    processUploadedFile(noticeFormAvatarInput, onReaderAvatarLoad);
  };

  var onNoticeFormPhotoInputChange = function () {
    var onReaderPhotoLoad = function (evtReader) {
      var newPhotoNode = document.createElement('img');
      var reader = evtReader.target;
      newPhotoNode.src = reader.result;
      newPhotoNode.style.width = '130px';
      newPhotoNode.style.height = '130px';
      newPhotoNode.style.marginRight = '10px';
      newPhotoNode.style.marginTop = '5px';
      noticeFormPhotosContainer.insertBefore(newPhotoNode, noticeFormPhotoUpLoad);

      //  Очистка загруженного Input, для загрузки одинаковых фотографий
      noticeFormPhotoInput.value = '';
    };

    processUploadedFile(noticeFormPhotoInput, onReaderPhotoLoad);
  };

  var changeNoticeFormAddressInput = function (coords) {
    noticeFormAddressInput.value = 'x: {' + Math.round(coords.x) + '}, y: {' + Math.round(coords.y) + '}';
    noticeFormAddressInput.setCustomValidity('');
  };

  //  Имитация readOnly, чтобы поле было и required и readOnly
  var onNoticeFormAddressInputKeydown = function (evt) {
    evt.preventDefault();
  };

  var onNoticeFormAddressInputInvalid = function (evt) {
    var target = evt.target;

    if (target.validity.valueMissing) {
      target.setCustomValidity('Выберите новую точку на карте');
    } else {
      target.setCustomValidity('');
    }
  };

  //  Коллбек-фция при успешной отправке
  var onNoticeFormLoad = function () {
    noticeForm.reset();
  };

  //  Коллбек-фция при неудачной отправке
  var onNoticeFormError = function (errorType) {
    window.utility.onDefaultError(errorType, 'default', function (node, message) {
      node.style.top = 0;
      node.style.backgroundColor = 'orange';
      node.textContent = 'Во время работы с формой возникли проблемы. ' + message;
    });
  };

  var onNoticeFormReset = function () {
    //  Сброс минимальной стоимости
    noticeFormPriceInput.min = PRICE_INPUT_MIN_DEFAULT;
    noticeFormPriceInput.placeholder = noticeFormPriceInput.min;
    syncValueWithOptions(noticeFormCapacitySelect, CAPACITY[0]);
  };

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(noticeForm), onNoticeFormLoad, onNoticeFormError);
    evt.preventDefault();
  });
  noticeForm.addEventListener('reset', onNoticeFormReset);

  disableNoticeForm();
  initInputsSelectsAttributes();

  window.synchronizeFields(noticeFormTimeInSelect, noticeFormTimeOutSelect, TIMES_IN, TIMES_OUT, syncValues);
  window.synchronizeFields(noticeFormTimeOutSelect, noticeFormTimeInSelect, TIMES_OUT, TIMES_IN, syncValues);

  window.synchronizeFields(noticeFormTypeSelect, noticeFormPriceInput, ROOM_TYPES, PRICE_INPUT_MIN_TYPES, syncValueWithMin);
  window.synchronizeFields(noticeFormRoomstSelect, noticeFormCapacitySelect, ROOMS, CAPACITY, syncValueWithOptions);

  noticeFormAvatarInput.addEventListener('change', onNoticeFormAvatarInputChange);

  //  Формирование контейнера карточной формы
  noticeFormPhotosContainer.style.display = 'flex';
  noticeFormPhotosContainer.style.flexWrap = 'wrap';
  noticeFormPhotosContainer.style.width = 'auto';

  noticeFormPhotoUpLoad.style.width = '130px';
  noticeFormPhotoUpLoad.style.marginRight = '10px';
  noticeFormPhotoUpLoad.style.marginTop = '5px';

  noticeFormPhotoInput.addEventListener('change', onNoticeFormPhotoInputChange);

  noticeFormTitleInput.addEventListener('input', onNoticeFormTitleInputInput);
  noticeFormTitleInput.addEventListener('invalid', onNoticeFormTitleInputInvalid);

  noticeFormAddressInput.addEventListener('keydown', onNoticeFormAddressInputKeydown);
  noticeFormAddressInput.addEventListener('invalid', onNoticeFormAddressInputInvalid);

  window.form = {
    enableNoticeForm: enableNoticeForm,
    changeNoticeFormAddressInput: changeNoticeFormAddressInput
  };
})();
