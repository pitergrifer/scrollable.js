Object.prototype.scrollable = function(settings) {
  /* Явное указание контейнера */ 
  var self = this;
  
  /* Функция проверки типа устройства */
  function isMobile() {
    if (navigator.userAgent.match(/Android/ig) ||
        navigator.userAgent.match(/webOS/ig) ||
        navigator.userAgent.match(/iPhone/ig) ||
        navigator.userAgent.match(/iPod/ig) ||
        navigator.userAgent.match(/iPad/ig) ||
        navigator.userAgent.match(/Blackberry/ig)) { // true - если мобильные устройства
      return true;  
    } else { // false - если настольные
      return false;
    };
  };
  
  /* Основная функция генерации полосы прокрутки */
  function generateScroller() {
    // Блок с настройками
    var scrollerClass = settings.scrollerClass;
    var arrows = settings.arrows;
    if (arrows == true) {
      var arrowsClass = settings.arrowsClass;
    };
    var sliderClass = settings.sliderClass;
    var sliderHeight = settings.sliderHeight;
    if (sliderHeight == "auto") {
      var sliderHeightMin = settings.sliderHeightMin;
    };
    var sliderShift = settings.sliderShift;
    var stepMultipler = settings.stepMultipler;
    if (settings.autoHide == true) {
      var scrollerOpacityActive = settings.scrollerOpacityActive;
      var scrollerOpacityPassive = settings.scrollerOpacityPassive;
    };
    
    // Установка tabindex на контейнере позволит взять его в фокус 
    self.setAttribute('tabindex', '1');
    
    // Функция добавления елементам основных свойств, так как в последующих операциях есть паттерн
    function makeByStandart(element, parent, position, className) {
      parent.appendChild(element);
      if (className) {
        element.className = className;  
      };
      element.style.position = position;
      element.style.boxSizing = "border-box";
      element.style.WebkitBoxSizing = "border-box";
      element.style.MozBoxSizing = "border-box";
      element.style.MBoxSizing = "border-box";
      element.style.OBoxSizing = "border-box";
      element.style.padding = "0";
      element.style.margin = "0";
      element.style.borderWidth = "1px";
      element.style.overflow = "hidden";
    };
    
    // Обертывание всего контента контейнера
    var content = self.innerHTML;
    self.innerHTML = "";
    var wrapper = document.createElement('div');
    makeByStandart(wrapper, self, "relative");
    wrapper.innerHTML = content;
    // Определение внутрених отступов сверху
    var selfPaddingTop = wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top;
    
    // Создание полосы прокрутки
    var scroller = document.createElement('div');
    makeByStandart(scroller, self, "absolute", scrollerClass);
    scroller.setAttribute('data-type', 'scroller'); // Установка атрибута "data-type" на некоторых элементах нужна для их использования в нескольких событиях ниже
    scroller.style.height = self.clientHeight + "px";
    scroller.style.top = "0";
    scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
    if (sliderShift == true) { // если смещение true, тогда увеличивать правый отступ контейнера на ширину панели прокрутки
      self.style.paddingRight = (self.clientWidth - wrapper.offsetWidth) / 2 + scroller.offsetWidth + "px";
    };
    
    // Создание стрелок для полосы прокрутки
    if (arrows == true) { // если указано наличие стрелок - создавать их
      var arrowUp = document.createElement('div');
      var arrowDown = document.createElement('div');
      arrowUp.setAttribute('data-type', 'arrowUp');
      arrowDown.setAttribute('data-type', 'arrowDown');
      var arrowsPack = [arrowUp, arrowDown]; // выборка стрелок в массив нужна для сокращения кода
      
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        makeByStandart(arrowsPack[arrowCounter], scroller, "absolute", arrowsClass);
        arrowsPack[arrowCounter].style.width = scroller.clientWidth + "px";
        arrowsPack[arrowCounter].style.height = scroller.clientWidth + "px";
      };
      arrowDown.style.top = scroller.clientHeight - arrowDown.offsetHeight + "px";
      
      // вычисление начала свободной зоны для позиционирования ползунка
      var topEdge = arrowUp.offsetWidth;
      // вычисление всей допустимой зоны хождения ползунка
      var sliderFieldHeight = scroller.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight);
    } else { // если стрелок нет - провести другие расчеты
      var topEdge = 0;
      var sliderFieldHeight = scroller.clientHeight;
    };
    
    // Создание ползунка
    var slider = document.createElement('div');
    makeByStandart(slider, scroller, "absolute", sliderClass);
    slider.setAttribute('data-type', 'slider');
    slider.style.width = scroller.clientWidth + "px";
    if (sliderHeight == "auto") { // если высота ползунка "auto" (настройки объекта, а не CSS), то произвести расчет данной величины
      var selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPaddingTop * 2) / 100); // высчитываем процент
      sliderHeight = sliderFieldHeight / 100 * selfWrapperRatio; // высота в пикселях относительно процентов(selfWrapperRatio) из допустимой зоны хождения ползунка sliderFieldHeight 
      if (sliderHeight < sliderHeightMin) { // установка минимальной высоты ползунка
        sliderHeight = sliderHeightMin;
      };
    };
    if (sliderHeight > sliderFieldHeight) { // установка максимальной высоты ползунка
      sliderHeight = sliderFieldHeight;
    };
    // позиционирование ползунка
    slider.style.height = sliderHeight + "px";
    slider.style.top = topEdge + "px";
    
    // Блок с событиями
    // событие "перетаскивания" ползунка
    slider.onmousedown = function(event) {
      event = event || window.event;
      
      // переменная для корректного расчета координат "захвата" ползунка курсором
      var сorrectPick = event.clientY - slider.getBoundingClientRect().top;
      
      // Функция позиционирования ползунка. Используется в событиях mousedown и mousemove
      function sliderScroll(event) {
        var sliderCoordsOld = slider.getBoundingClientRect(); // запомнить первоначальные координаты
        var newTop = event.clientY - scroller.getBoundingClientRect().top - scroller.clientTop - сorrectPick; // расчитать новый отступ сверху
        var bottomEdge = sliderFieldHeight - sliderHeight;
        if (arrows == true) { // определить крайную нижную точку прокрутки, в зависимости от наличия стрелок 
          bottomEdge += arrowUp.offsetHeight;  
        };
        if (newTop <= topEdge) { // проверка на "вылет" за верхнюю границу 
          newTop = topEdge;
        } else if (newTop >= bottomEdge) { // проверка на вылет за нижнюю границу 
          newTop = bottomEdge;
        };
        // позиционирование ползунка
        slider.style.top = newTop + "px";
        // прокрутка видимой области (устанавливается через отступ сверху, так как .scrollBy(x,y) не принимает дробные значения)
        var sliderCoordsNew = slider.getBoundingClientRect(); // запомнить новые координаты ползунка
        var ratioFactor = ((wrapper.offsetHeight + selfPaddingTop * 2) - self.clientHeight) / (sliderFieldHeight - sliderHeight); // коэффициент-множитель скорости прокрутки
        var scrollSpeed = (sliderCoordsNew.top - sliderCoordsOld.top) * ratioFactor;
        var wrapperPositionOld = (wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top) - selfPaddingTop;
        wrapper.style.top = wrapperPositionOld - scrollSpeed + "px";
      };
      
      sliderScroll(event);
      
      document.onmousemove = function(event) {
        sliderScroll(event);
        if (settings.autoHide == true) scroller.style.opacity = scrollerOpacityActive;
      };
      
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        if (settings.autoHide == true) scroller.style.opacity = scrollerOpacityPassive;
      };
      
      return false;
    };
    
    // Добавление эффекта исчезающей полосы прокрутки
    if (settings.autoHide == true) {
      var hideBy = undefined;
      scroller.style.opacity = 0;
      self.onmouseover = function(event) {
        scroller.style.opacity = scrollerOpacityPassive;
      };
      self.onmouseout = function(event) {
        scroller.style.opacity = 0;
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
      };
      function autoHideOnEvents() {
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
        scroller.style.opacity = scrollerOpacityActive;
        hideBy = setTimeout(function() {
          scroller.style.opacity = scrollerOpacityPassive;
        }, 1000);
        return hideBy;
      };
    };
    
    // Функция прокрутки с общим алгоритмом для колесика, клавиатуры, виртуальных стрелок
    function scrollGeneric(event, scrollStep) {
      // прокрутка поля видимости
      var oldWrapperTop = (wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top) - selfPaddingTop;
      var newWrapperTop = oldWrapperTop - scrollStep;
      
      // прокрутка ползунка
      var sliderFactor = ((wrapper.offsetHeight + selfPaddingTop * 2) - self.clientHeight) / (sliderFieldHeight - sliderHeight);
      var newSliderTop = (newWrapperTop / sliderFactor) * -1;
      if (arrows == true) {
        newSliderTop += arrowUp.offsetHeight;
      };
      
      // проверка на вылет
      var bottomEdge = sliderFieldHeight - sliderHeight;
      if (arrows == true) {
        bottomEdge += arrowUp.offsetHeight;
      };
      if (newSliderTop < topEdge) {
        newSliderTop = topEdge;
        newWrapperTop = 0;
      } else if (newSliderTop > bottomEdge) {
        newSliderTop = bottomEdge;
        newWrapperTop = (wrapper.offsetHeight - self.clientHeight + selfPaddingTop * 2) * -1;
      };
      
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: newWrapperTop
      };
    };
    
    // событие скроллинга посредством колесика мыши
    if (settings.useWheelScroll == true) {
      function onwheelFixer(elem, func) { // полифил для корректной работы события "onwheel"
        if (elem.addEventListener) {
          if ('onwheel' in document) {
            // IE9+, FF17+, Ch31+
            elem.addEventListener("wheel", func);
          } else if ('onmousewheel' in document) {
            // устаревший вариант события
            elem.addEventListener("mousewheel", func);
          } else {
            // Firefox < 17
            elem.addEventListener("MozMousePixelScroll", func);
          };
        } else { // IE8-
          elem.attachEvent("onmousewheel", func);
        };
      };
      function wheelScroll(event) { // функция прокрутки колесиком мыши
        event = event || window.event;
        
        var delta = event.deltaY || event.detail || event.wheelDelta;
        var scrollStep = delta * stepMultipler;
        
        var result = scrollGeneric(event, scrollStep);
        
        if (settings.autoHide == true) autoHideOnEvents();
        
        wrapper.style.top = result.newWrapperTop + "px";
        slider.style.top = result.newSliderTop + "px";
      };
      onwheelFixer(self, wheelScroll);
    };
    
    // событие скроллинга посредством клавиатуры (обернуто в "focus" во избежание конфликтов со всей страницей и ее прокруткой, если такая имеется).
    if (settings.useKeyboardScroll == true) {
      self.onfocus = function() {
        self.onkeydown = function(event) {
          event = event || window.event;
          
          function keyboardScroll(event, arrowBtnCode, pageBtnCode, positivity) {
            var scrollStep = 0;
            if (event.keyCode == arrowBtnCode) {
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode == pageBtnCode) {
              scrollStep = (self.clientHeight) * positivity;
            };
            
            var result = scrollGeneric(event, scrollStep);
            
            if (settings.autoHide == true) autoHideOnEvents();
            
            wrapper.style.top = result.newWrapperTop + "px";
            slider.style.top = result.newSliderTop + "px";
          };
          
          // если нажаа клавиша "Вверх" или "Page Up"
          if (event.keyCode == 38 || event.keyCode == 33) {
            keyboardScroll(event, 38, 33, -1);
          };
          
          // если нажата клавиша "Вниз" или "Page Down"
          if (event.keyCode == 40 || event.keyCode == 34) {
            keyboardScroll(event, 40, 34, 1);
          };
        };
      };
      self.onblur = function() {
        scroller.style.opacity = 0;
      };
    };
    
    // событие скроллинга посредством выделения текста
    if (settings.scrollBySelection == true) {
      self.onmousedown = function(event) {
        event = event || window.event;
        
        function selectionScroll(event) {
          var scrollStep = 0;
          if (event.clientY < self.getBoundingClientRect().top) {
            scrollStep = stepMultipler * -1;
          } else if (event.clientY > self.getBoundingClientRect().bottom) {
            scrollStep = stepMultipler;
          };
          
          var result = scrollGeneric(event, scrollStep);
          
          wrapper.style.top = result.newWrapperTop + "px";
          slider.style.top = result.newSliderTop + "px";
        };
        
        selectionScroll(event);
        
        self.onmousemove = function(event) {
          selectionScroll(event);
        };
      };
    };
    
    // событие скроллинга виртуальными стрелками и щелчками по полю хождения ползунка (используется делегирование)
    var loops = { // объект-индикатор, показывающий статус функции непрерывного прокручивания (она оглашается ниже)
      looper: undefined,
      repeat: true 
    };
    scroller.onmousedown = function(event) {
      event = event || window.event;
      var target = event.target;
      
      function mouseGeneric(positivity, type) { // общий алгоритм для виртуальных стрелок и поля прокрутки
        var scrollStep = stepMultipler * positivity;
        if (type == "arrowUp" || type == "arrowDown") {
          scrollStep = stepMultipler * positivity;
        } else if (type == "scroller") {
          scrollStep = self.clientHeight * positivity;
        };
        var result = scrollGeneric(event, scrollStep);
        slider.style.top = result.newSliderTop + "px";
        wrapper.style.top = result.newWrapperTop + "px";
        if (settings.autoHide == true) autoHideOnEvents();
      };
      
      function loopedMouseGeneric(positivity, type) { // функция непрерывного прокручивания
        var looper = setTimeout(function() {
          function repeatAgain() {
            if (loops.repeat == true) {
              var repeater = setTimeout(function() {
                mouseGeneric(positivity, type);
                repeatAgain();
              }, 50);
            };
          };
          loops.repeat == true
          repeatAgain();
        }, 300);
        return loops = {
          looper: looper,
          repeat: true
        };
      };
      
      if (target.getAttribute('data-type') == "arrowUp") { // событие по клику на стрелку "Вверх"
        mouseGeneric(-1, "arrowUp");
        loopedMouseGeneric(-1, "arrowUp");
      } else if (target.getAttribute('data-type') == "arrowDown") { // событие по клику на стрелку "Вниз"
        mouseGeneric(1, "arrowDown");
        loopedMouseGeneric(1, "arrowDown");
      } else if (target.getAttribute('data-type') == "scroller") { // событие по клику на пустую зону поля хождения ползунка
        if (event.clientY < slider.getBoundingClientRect().top) {
          mouseGeneric(-1, "scroller");
          loopedMouseGeneric(-1, "scroller");
        } else if (event.clientY > slider.getBoundingClientRect().bottom) {
          mouseGeneric(1, "scroller");
          loopedMouseGeneric(1, "scroller");
        };
      } else { // иначе сделать возврат 
        return;
      };
    };
    // если функция непрерывной прокрутки запущена - остановить ее по отжатию клавиши мыши
    scroller.onmouseup = function() {
      if (loops.looper != undefined) {
        clearTimeout(loops.looper);
        loops.repeat = false;
      };
    };
  };
  
  /* Проверка на тип устройства */
  if(isMobile() == true) {
    self.style.overflowY = "scroll";
  } else {
    generateScroller();
  };
};

/* Использование */
var container = document.getElementById('container');
container.scrollable({
  scrollerClass: "scroller-field", // css-класс скроллера
  arrows: true, // наличие стрелок (флаги значения: "true", "false") 
  arrowsClass: "scroller-arrows", // css-класс стрелок
  sliderClass: "scroller-slider", // css-класс ползунка
  sliderHeight: "auto", // высота ползунка ("auto" - расчитывается в зависимости от контента; число (без указания пикселей или процентов) - высота в пикселях)
  sliderHeightMin: 30, // минимальная высота ползунка в пикселях (указывать еденицу измерения ненужно)
  sliderShift: true, // наличие смещения контента для скроллера (флаги "true", "false")
  stepMultipler: 10, // скорость прокрутки
  scrollBySelection: true, // возможность прокрутки при выделении текста (флаги "true", "false")
  useWheelScroll: true, // возможность прокрутки колесиком мыши (флаги "true", "false")
  useKeyboardScroll: true, // возможность прокрутки клавишами "Стрелки", "PageUp" и "PageDown" (флаги "true", "false")
  autoHide: true, // наличие эффекта исчезающей полосы прокрутки (флаги "true", "false")
  scrollerOpacityActive: 1,
  scrollerOpacityPassive: 0.4
});