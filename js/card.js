'use strict';

(function () {
  var OFFER_AVAILABLE_FEATURES_NODES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  //  Функция, путем удаления, убирает все недоступные 'удобства' из узла, которых нет в массиве (features)
  //  node (object) - узел содержащий ВСЕ возможные удобства
  //  features (object) - массив текущих удобств
  var buildMapCardFeatures = function (node, features) {
    for (var i = 0; i < OFFER_AVAILABLE_FEATURES_NODES.length; i++) {
      if (!features.includes(OFFER_AVAILABLE_FEATURES_NODES[i])) {
        node.removeChild(node.querySelector('.feature--' + OFFER_AVAILABLE_FEATURES_NODES[i]));
      }
    }
  };

  var buildMapCardPhotos = function (node, photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      //  Копируем заготовку <li>
      var ulChildNode = node.children[0].cloneNode(true);

      //  Настраиваем <img> в теге <li>
      ulChildNode.children[0].src = photo;
      ulChildNode.children[0].style.width = '100px';
      ulChildNode.children[0].style.height = '100px';
      ulChildNode.children[0].style.marginRight = '5px';

      //  Сибираем фрагмент
      fragment.appendChild(ulChildNode);
    });

    //  Выставляем настройки списка фото <ul>, чтобы был скролинг по горизонтали и не занимал много высоты
    node.style.display = 'flex';
    node.style.overflow = 'auto';
    node.style.height = '130px';
    node.appendChild(fragment);
    node.removeChild(node.children[0]);
  };

  //  Функция создает DOM элемент шаблона (template) 'article.map__card', согласно массиву объектов mapPins
  //  mapPin (object) - объект mapPin
  //  return mapCardNode (object) - вернуть узел
  var buildMapCard = function (mapPin) {
    var mapCardNode = document.querySelector('template').content.querySelector('article.map__card').cloneNode(true);
    var mapCardNodeAvatar = mapCardNode.querySelector('.popup__avatar');
    var mapCardNodeTitle = mapCardNode.querySelector('h3');
    var mapCardNodeAddress = mapCardNode.querySelector('p:first-of-type');
    var mapCardNodePrice = mapCardNode.querySelector('.popup__price');
    var mapCardNodeType = mapCardNode.querySelector('h4');
    var mapCardNodeRoomsGuests = mapCardNode.querySelector('p:nth-of-type(3)');
    var mapCardNodeCheckInOut = mapCardNode.querySelector('p:nth-of-type(4)');
    var mapCardNodeFeatures = mapCardNode.querySelector('.popup__features');
    var mapCardNodeDescription = mapCardNode.querySelector('p:last-of-type');
    var mapCardNodePhotos = mapCardNode.querySelector('.popup__pictures');

    mapCardNodeAvatar.src = mapPin.author.avatar;
    mapCardNodeTitle.textContent = mapPin.offer.title;
    mapCardNodeAddress.textContent = mapPin.offer.address;
    mapCardNodePrice.textContent = mapPin.offer.price + '	\u20BD/ночь';
    mapCardNodeType.textContent = mapPin.offer.type;
    mapCardNodeRoomsGuests.textContent = mapPin.offer.rooms + ' комнаты для ' + mapPin.offer.guests + ' гостей';
    mapCardNodeCheckInOut.textContent = 'Заезд после ' + mapPin.offer.checkin + ', выезд до ' + mapPin.offer.checkout;
    buildMapCardFeatures(mapCardNodeFeatures, mapPin.offer.features);
    mapCardNodeDescription.textContent = mapPin.offer.description;
    buildMapCardPhotos(mapCardNodePhotos, mapPin.offer.photos);

    mapCardNode.style.display = 'none';

    return mapCardNode;
  };

  //  Определение соответствующей этой кнопке предложения
  //  Поиск по ID кнопки в datasets предложений
  var hideCard = function (pinId) {
    var card = document.querySelector('[data-pin=\"' + pinId + '\"]');
    card.style.display = 'none';
  };

  var onMapCardClick = function (evt) {
    var target = evt.target;

    if (target.classList.contains('popup__close')) {
      window.pin.disableActivePinOffer();

      document.removeEventListener('keydown', window.map.onMapEscPress);
    }
  };

  var onMapCardEnterPress = function (evt) {
    if (evt.keyCode === window.utility.ENTER_KEYCODE) {
      onMapCardClick(evt);
    }
  };

  var initializeMapCardEvent = function (mapCardNode) {
    mapCardNode.addEventListener('click', onMapCardClick);
    mapCardNode.addEventListener('keydown', onMapCardEnterPress);
  };

  window.card = {
    buildMapCard: buildMapCard,
    hideCard: hideCard,
    initializeMapCardEvent: initializeMapCardEvent
  };
})();
