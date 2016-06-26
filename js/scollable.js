Object.prototype.scrollable = function(settings) {
  // Блок с настройками
  var self = this;
  var scrollerClass = settings.scrollerClass;
  var arrows = settings.arrows;
  if (arrows == true) {
  	var arrowsClass = settings.arrowsClass;
  };
  var sliderClass = settings.sliderClass;
  
  // Обертывание всего контента контейнера
  var content = self.innerHTML;
  self.innerHTML = "";
  var wrapper = document.createElement('div');
  self.appendChild(wrapper);
  wrapper.innerHTML = content;
  
  // Создание полосы прокрутки
  var scroller = document.createElement('div');
  self.appendChild(scroller);
  scroller.className = scrollerClass;
  scroller.style.position = "absolute";
  scroller.style.padding = "0";
  scroller.style.margin = "0";
  scroller.style.overflow = "hidden";
  scroller.style.height = self.clientHeight - scroller.clientTop * 2 + "px";
  scroller.style.top = "0";
  scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
  
  // Создание стрелок для полосы прокрутки
  if (arrows == true) {
  	var arrowUp = document.createElement('div');
    var arrowDown = document.createElement('div');
    var arrowsPack = [arrowUp, arrowDown];
    arrowUp.style.borderWidth = "1px";
    arrowDown.style.borderWidth = "1px";
    var arrowsSize = scroller.clientWidth - 2;
    
    for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
      scroller.appendChild(arrowsPack[arrowCounter]);
      arrowsPack[arrowCounter].className = arrowsClass;
      arrowsPack[arrowCounter].style.position = "absolute";
      arrowsPack[arrowCounter].style.padding = "0";
      arrowsPack[arrowCounter].style.margin = "0";
      arrowsPack[arrowCounter].style.width = arrowsSize + "px";
      arrowsPack[arrowCounter].style.height = arrowsSize + "px";
      arrowsPack[arrowCounter].style.borderWidth = "1px";
    };
    arrowDown.style.top = scroller.clientHeight - arrowsSize - 2 + "px";
    
    // вычисление начала свободной зоны для позиционирования ползунка
    var topEdge = arrowUp.offsetWidth;
  } else {
    var topEdge = 0;
  };
  
  // Создание ползунка
  var slider = document.createElement('div');
  scroller.appendChild(slider);
  slider.className = sliderClass;
  slider.style.position = "absolute";
  slider.style.padding = "0";
  slider.style.margin = "0";
  slider.style.borderWidth = "1px";
  slider.style.width = scroller.clientWidth - slider.clientLeft * 2 + "px";
  var sliderHeight = (self.clientHeight / 100) * (self.clientHeight / (wrapper.offsetHeight / 100));
  if (sliderHeight < 10) {
    sliderHeight = 10;
  };
  slider.style.height = sliderHeight + "px";
  slider.style.top = topEdge + "px";
};

var container = document.getElementById('container');
container.scrollable({
  scrollerClass: "scroller-field",
  arrows: true,
  arrowsClass: "scroller-arrows",
  sliderClass: "scroller-slider"
});