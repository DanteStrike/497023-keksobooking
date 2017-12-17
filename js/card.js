'use strict';

(function () {
  var OFFER_AVAILABLE_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  //  Функция, путем удаления, убирает все недоступные 'удобства' из узла, которых нет в массиве (features)
  //  node (object) - узел содержащий ВСЕ возможные удобства
  //  features (object) - массив текущих удобств
  var buildMapCardFeatures = function (node, features) {
    for (var i = 0; i < OFFER_AVAILABLE_FEATURES.length; i++) {
      if (features.indexOf(OFFER_AVAILABLE_FEATURES[i]) === -1) {
        node.removeChild(node.querySelector('.feature--' + OFFER_AVAILABLE_FEATURES[i]));
      }
    }
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

    mapCardNodeAvatar.src = mapPin.author.avatar;
    mapCardNodeTitle.textContent = mapPin.offer.title;
    mapCardNodeAddress.textContent = mapPin.offer.address;
    mapCardNodePrice.textContent = mapPin.offer.price + '	\u20BD/ночь';
    mapCardNodeType.textContent = mapPin.offer.type;
    mapCardNodeRoomsGuests.textContent = mapPin.offer.rooms + ' комнаты для ' + mapPin.offer.guests + ' гостей';
    mapCardNodeCheckInOut.textContent = 'Заезд после ' + mapPin.offer.checkin + ', выезд до ' + mapPin.offer.checkout;
    buildMapCardFeatures(mapCardNodeFeatures, mapPin.offer.features);
    mapCardNodeDescription.textContent = mapPin.offer.description;

    mapCardNode.style.display = 'none';

    return mapCardNode;
  };

  //  Поиск индекса активной кнопки относительно массива всех сгенерированных кнопок
  //  Для определения соответствующей этой кнопке предложения
  var hideCard = function (pinNode, pinNodes) {
    var mapCards = document.querySelectorAll('.map__card');
    var offerIndex = [].indexOf.call(pinNodes, pinNode);
    mapCards[offerIndex].style.display = 'none';
  };

  var onMapCardClick = function (evt) {
    var target = evt.target;
    var pinIndex;

    if (target.classList.contains('popup__close')) {
      target.parentNode.style.display = 'none';
      window.pin.disablePin();

      document.removeEventListener('keydown', window.map.onMapEscPress);
    }
  };

  var onMapCardEnterPress = function (evt) {
    if (evt.keyCode === window.map.enterKeyCode) {
      onMapCardClick(evt);
    }
  };

  var initializeMapCardEvent = function (mapCardNode) {
    mapCardNode.addEventListener('click', onMapCardClick);
    mapCardNode.addEventListener('keydown', onMapCardEnterPress);
  }

  window.card = {
    buildMapCard: buildMapCard,
    hideCard: hideCard,
    initializeMapCardEvent: initializeMapCardEvent
  };
})();
