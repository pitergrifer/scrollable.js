/*
 * scrollable.js
 *
 * scrollable.js - it`s custom prototype for vanilla JavaScript object.
 * Read README.txt form more information and information about usege.
 *
 * Bogdan Danileichenko (@piter_grifer)
 */

Element.prototype.scrollable = function(settings) {
  // -- Polyfill for add/remove events listeners -- //
  function eventListener(action, element, type, func) {
    if (action == 'add') { // add event listener
      if (document.addEventListener) { // if it good browser 
      element.addEventListener(type, func);
      } else { // if it retardet IE8 or later
        element.attachEvent('on' + type, func);
      };
    } else if (action == "remove") { // remove event listener
        if (document.removeEventListener) {
        element.removeEventListener(type, func);
      } else {
        element.detachEvent('on' + type, func);
      };
    } else {
      console.error("Wrong usege of function \"eventListener\"");
    };
  };
  
  // -- Polyfill for get css-style -- //
  function getStyle(elem) {
    return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
  };
  
  /* Pointer to object ("container" further) */
  var self = this;
  
  /* Function for detect type of device */
  function isMobile() {
    if (navigator.userAgent.match(/Android/ig) ||
        navigator.userAgent.match(/webOS/ig) ||
        navigator.userAgent.match(/iPhone/ig) ||
        navigator.userAgent.match(/iPod/ig) ||
        navigator.userAgent.match(/iPad/ig) ||
        navigator.userAgent.match(/Blackberry/ig)) { // true - if mobile device
      return true;  
    } else { // false - if desktop device
      return false;
    };
  };
  
  /* Main function of generation scroller */
  function generateScroller() {
    // -- Block with main variables -- //
    var scrollerClass = settings.scrollerClass;
    var arrows = settings.arrows;
    if (arrows == true) {
      var arrowsClass = settings.arrowsClass;
      var arrowChevron = settings.arrowChevron;
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
      var scrollerOpacityHidden = settings.scrollerOpacityHidden;
    };
    var horizontalScrolling = settings.horizontalScrolling;
    if (horizontalScrolling == "auto" || horizontalScrolling == true) {
      var scrollerXClass = settings.scrollerXClass;
      var sliderWidth = sliderHeight;
    };
    
    // -- Set attribute "tabindex" at container (it do event "onfocus" available) -- //
    self.setAttribute('tabindex', '1');
    // -- Most of elements must have 'data-type' identifier -- //
    self.setAttribute('data-type', 'container');
    
    // -- Function of adding standart css propertys -- //
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
      element.style.padding = "0px";
      element.style.margin = "0px";
      element.style.borderWidth = "1px";
      element.style.overflow = "hidden";
    };
    
    // -- Wrap the whole content of the container in div "wrapper" -- //
    var content = self.innerHTML;
    self.innerHTML = "";
    var wrapper = document.createElement('div');
    makeByStandart(wrapper, self, "relative");
    wrapper.setAttribute('data-type', 'wrapper');
    wrapper.innerHTML = content;
    if (horizontalScrolling == "auto" || horizontalScrolling == true) {
      var wrappedContent = wrapper.children;
      var wrappedContentLength = wrappedContent.length;
      var contentMaxWidth = wrappedContent[0].offsetWidth;
      for (var wrapperCounter = 1; wrapperCounter < wrappedContentLength; wrapperCounter++) {
        if (wrappedContent[wrapperCounter].offsetWidth > contentMaxWidth) {
          contentMaxWidth = wrappedContent[wrapperCounter].offsetWidth;
        };
      };
      if (contentMaxWidth > wrapper.offsetWidth) {
        horizontalScrolling = true;
        wrapper.style.width = contentMaxWidth + "px";
      } else {
        horizontalScrolling = false;
      };
    };
    var selfBorder = {
      top: parseInt(getStyle(self).borderTopWidth),
      bottom: parseInt(getStyle(self).borderBottomWidth),
      left: parseInt(getStyle(self).borderLeftWidth),
      right: parseInt(getStyle(self).borderRightWidth)
    };
    var selfPaddingTop = wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top;
    var selfPaddingBottom = parseInt(getStyle(self).paddingBottom) + self.clientTop;
    if (horizontalScrolling == true) {
      var selfPaddingLeft = wrapper.getBoundingClientRect().left - self.getBoundingClientRect().left;
      var selfPaddingRight = parseInt(getStyle(self).paddingLeft) + self.clientLeft;
    };
    
    // -- Function for creation vertical and horizontal scroll bars -- //
    function makeScroller(axis) {
      var scroller = document.createElement('div');
      if (axis == "X") { // horizontal scroll bar
        makeByStandart(scroller, self, "absolute", scrollerXClass);
        scroller.setAttribute('data-type', 'scrollerX');
        var scrollersArray = document.querySelectorAll("." + scrollerClass);
        scroller.style.width = self.clientWidth - scrollersArray[0].offsetWidth + "px";
        scroller.style.height = scrollersArray[0].offsetWidth + "px";
        scroller.style.top = self.clientHeight - scroller.offsetHeight + "px";
        scroller.style.left = "0px";
      } else if (axis == "Y") { // vertical scroll bar
        makeByStandart(scroller, self, "absolute", scrollerClass);
        scroller.setAttribute('data-type', 'scroller');
        if (horizontalScrolling == true) {
          scroller.style.height = self.clientHeight - scroller.offsetWidth + "px";  
        } else {
          scroller.style.height = self.clientHeight + "px";
          if (sliderShift == true) {
            self.style.paddingRight = parseInt(getStyle(self).paddingRight) + scroller.offsetWidth + "px";
          };
        };
        scroller.style.top = "0px";
        scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
      };
      if (navigator.userAgent.match(/MSIE 8.0/ig)) {
        if (getStyle(scroller).backgroundColor == "transparent") {
          var parentBackground = getStyle(self).backgroundColor;
          if (parentBackground != "transparent") {
            scroller.style.backgroundColor = parentBackground;
          } else {
            scroller.style.backgroundColor = "white";
          };
        };
      };
      scroller.style.zIndex = 5;
      return scroller;
    };
    
    // -- Create a vertical scroll bar -- //
    var scroller = makeScroller("Y");
    // -- Create a horizontal scroll bar -- //
    if (horizontalScrolling == true) var scrollerX = makeScroller("X");
    
    // -- Create a arrows -- //
    if (arrows == true) {
      var arrowUp = document.createElement('div');
      var arrowDown = document.createElement('div');
      var arrowsPack = [arrowUp, arrowDown];
      var chevronPack = [arrowChevron.top, arrowChevron.bottom];
      if (horizontalScrolling == true) {
        var arrowLeft = document.createElement('div');
        var arrowRight = document.createElement('div');
        arrowsPack.push(arrowLeft, arrowRight);
        chevronPack.push(arrowChevron.left, arrowChevron.right);
      };
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        if (arrowCounter > 1) {
          makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
        } else {
          makeByStandart(arrowsPack[arrowCounter], scroller, "absolute", arrowsClass);  
        };
        arrowsPack[arrowCounter].style.width = scroller.clientWidth + "px";
        arrowsPack[arrowCounter].style.height = scroller.clientWidth + "px";
        arrowsPack[arrowCounter].innerHTML = chevronPack[arrowCounter];
      };
      arrowDown.style.top = scroller.clientHeight - arrowDown.offsetHeight + "px";
      var topEdge = arrowUp.offsetWidth;
      var sliderFieldHeight = scroller.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight);
      if (horizontalScrolling == true) {
        arrowRight.style.left = scrollerX.clientWidth - arrowRight.offsetWidth + "px";
        var leftEdge = arrowLeft.offsetWidth;
        var sliderFieldXWidth = scrollerX.clientWidth - (arrowLeft.offsetWidth + arrowRight.offsetWidth);
      };
    } else {
      var topEdge = 0;
      var sliderFieldHeight = scroller.clientHeight;
      if (horizontalScrolling == true) {
        var leftEdge = 0;
        var sliderFieldXWidth = scrollerX.clientWidth;
      }; 
    };
    
    // -- Function for creation a vertical and horizontal sliders -- //
    function createSlider(axis) {
      var slider = document.createElement('div');
      if (axis == "Y") { // slider for vertical scroller
        makeByStandart(slider, scroller, "absolute", sliderClass);
        slider.setAttribute('data-type', 'slider')
        slider.style.width = scroller.clientWidth + "px";
        if (sliderHeight == "auto") {
          var selfWrapperRatio;
          if (horizontalScrolling == true) {
            selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom + scrollerX.offsetHeight) / 100);
          } else {
            selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom) / 100);
          };
          sliderHeight = sliderFieldHeight / 100 * selfWrapperRatio;
          if (sliderHeight < sliderHeightMin) {
            sliderHeight = sliderHeightMin;
          };
        };
        if (sliderHeight > sliderFieldHeight) {
          sliderHeight = sliderFieldHeight;
        };
        slider.style.height = sliderHeight + "px";
        slider.style.top = topEdge + "px";
      } else if (axis == "X") { // slider for horizontal scroller
        makeByStandart(slider, scrollerX, "absolute", sliderClass);
        slider.setAttribute('data-type', 'sliderX');
        slider.style.height = scrollerX.clientHeight + "px";
        if (sliderWidth == "auto") {
          var selfWrapperRatioX = self.clientWidth / (wrapper.offsetWidth / 100);
          sliderWidth = sliderFieldXWidth / 100 * selfWrapperRatioX;
          if (sliderWidth < sliderHeightMin) {
            sliderWidth == sliderHeightMin;
          }; 
        };
        if (sliderWidth > sliderFieldXWidth) {
          sliderWidth = sliderFieldXWidth;
        };
        slider.style.width = sliderWidth + "px";
        slider.style.left = leftEdge + "px";
      };
      return slider;
    };
    
    // -- Create a vertical slider -- //
    var slider = createSlider("Y");
    // -- Create a horizontal slider -- //
    if (horizontalScrolling == true) var sliderX = createSlider("X");
    
    // -- Creatr plug in hole between scrollers -- //
    if (horizontalScrolling == true) {
      var plug = document.createElement('div');
      var selfCoords = self.getBoundingClientRect();
      self.appendChild(plug);
      plug.style.position = "absolute";
      plug.style.top = scroller.getBoundingClientRect().bottom - selfCoords.top - self.clientTop + "px";
      plug.style.left = scrollerX.getBoundingClientRect().right - selfCoords.left - self.clientLeft + "px";
      plug.style.width = selfCoords.bottom - selfBorder.bottom - scroller.getBoundingClientRect().bottom + "px";
      plug.style.height = selfCoords.right - selfBorder.right - scrollerX.getBoundingClientRect().right + "px";
      plug.style.backgroundColor = getStyle(scroller).backgroundColor;
    };
    
    // -- Adding effect of hideable scroll bar -- //
    if (settings.autoHide == true) {
      function adaptiveHide(element, value) {
        element.style.WebkitTransition = "opacity, 0.4s";
        element.style.transition = "opacity, 0.4s";
        element.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")\"";
        element.style.filter = "alpha(opacity=" + (value * 100) + ")";
        element.style.MozOpacity = value;
        element.style.KhtmlOpacity = value;
        element.style.opacity = value;
      };
      var hideBy = undefined;
      var hideByX = undefined;
      adaptiveHide(scroller, scrollerOpacityHidden);
      if (horizontalScrolling == true) {
        adaptiveHide(scrollerX, scrollerOpacityHidden);
        adaptiveHide(plug, scrollerOpacityHidden);
      };
      var mousePosition = 'unknown';
      self.onmouseenter = function(event) {
        adaptiveHide(scroller, scrollerOpacityPassive);
        if (horizontalScrolling == true) {
          adaptiveHide(scrollerX, scrollerOpacityPassive);
          adaptiveHide(plug, scrollerOpacityPassive);
        };
        mousePosition = 'inside';
      };
      self.onmouseleave = function(event) {
        adaptiveHide(scroller, scrollerOpacityHidden);
        if (horizontalScrolling == true) {
          adaptiveHide(scrollerX, scrollerOpacityHidden);
          adaptiveHide(plug, scrollerOpacityHidden);
        };
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
        mousePosition = 'outside'
      };
      function autoHideOnEvents(axis) {
        if (axis == "X") {
          if (hideByX != undefined) {
            clearTimeout(hideByX);
          };
          adaptiveHide(scrollerX, scrollerOpacityActive);
          adaptiveHide(plug, scrollerOpacityActive);
          hideByX = setTimeout(function() {
            if (mousePosition == 'inside') {
              adaptiveHide(scrollerX, scrollerOpacityPassive);
              adaptiveHide(plug, scrollerOpacityPassive);
            } else if (mousePosition == 'outside') {
              adaptiveHide(scrollerX, scrollerOpacityHidden);
              adaptiveHide(plug, scrollerOpacityHidden);
            };
          }, 1000);
        } else if (axis == "Y") {
          if (hideBy != undefined) {
            clearTimeout(hideBy);
          };
          adaptiveHide(scroller, scrollerOpacityActive);
          adaptiveHide(plug, scrollerOpacityActive);
          hideBy = setTimeout(function() {
            if (mousePosition == 'inside') {
              adaptiveHide(scroller, scrollerOpacityPassive);
              adaptiveHide(plug, scrollerOpacityPassive);
            } else if (mousePosition == 'outside') {
              adaptiveHide(scroller, scrollerOpacityHidden);
              adaptiveHide(plug, scrollerOpacityHidden);
            };
          }, 1000);
        };
      };
    };
    
    // -- Ratio factor formula for future calculation -- //
    var ratioFactor;
    if (horizontalScrolling == true) {
      if (sliderShift == true) {
        ratioFactor = ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom + scrollerX.offsetHeight) - (self.offsetHeight + (selfBorder.top - selfBorder.bottom))) / (sliderFieldHeight - sliderHeight);
        var ratioFactorX = ((wrapper.offsetWidth + selfPaddingLeft + selfPaddingRight + scroller.offsetWidth) - (self.offsetWidth + (selfBorder.left - selfBorder.right))) / (sliderFieldXWidth - sliderWidth);
      } else {
        ratioFactor = ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom) - (self.offsetHeight + (selfBorder.top - selfBorder.bottom))) / (sliderFieldHeight - sliderHeight);
        var ratioFactorX = ((wrapper.offsetWidth + selfPaddingLeft + selfPaddingRight) - (self.offsetWidth + (selfBorder.left - selfBorder.right))) / (sliderFieldXWidth - sliderWidth);
      };
    } else  {
      ratioFactor = ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom) - (self.offsetHeight + (selfBorder.top - selfBorder.bottom))) / (sliderFieldHeight - sliderHeight);
    };
    
    // -- Object for detection picked slider -- //
    var sliderPick = {
      slider: false,
      sliderX: false,
      wrapperY: 0,
      wrapperX: 0
    };
    
    // -- Generic function for vertical and horozontal sliders -- //
    function genericSlidersEvent(event, axis, sliderMainFunction) {
      function cancelSelection(event) {
        event = event || window.event;
        return false;
      };
      eventListener('add', document, 'selectstart', cancelSelection);
      eventListener('add', document, 'mousemove', sliderMainFunction);
      function clearEvent() {
        eventListener('remove', document, 'mousemove', sliderMainFunction);
        eventListener('remove', document, 'selectstart', cancelSelection);
        eventListener('remove', document, 'mouseup', clearEvent);
        if (settings.autoHide == true) {
          if (mousePosition == 'inside') {
            if (axis == "X") {
              adaptiveHide(scrollerX, scrollerOpacityPassive);
              adaptiveHide(plug, scrollerOpacityPassive);
            } else if (axis == "Y") {
              adaptiveHide(scroller, scrollerOpacityPassive);
              adaptiveHide(plug, scrollerOpacityPassive);  
            };
          } else if (mousePosition == 'outside') {
            if (axis == "X") {
              adaptiveHide(scrollerX, scrollerOpacityHidden);
              adaptiveHide(plug, scrollerOpacityHidden);
            } else if (axis == "Y") {
              adaptiveHide(scroller, scrollerOpacityHidden);
              adaptiveHide(plug, scrollerOpacityHidden);
            };
          };
        };
        if (axis == "X") {
          sliderPick.sliderX = false;
        } else if (axis == "Y") {
          sliderPick.slider = false;
        };
      };
      eventListener('add', document, 'mouseup', clearEvent);
    };
    
    // -- Event "Drag'n Drop" for vertical slider -- //
    slider.onmousedown = function(event) {
      event = event || window.event;
      var сorrectPick = event.clientY - slider.getBoundingClientRect().top;
      function sliderScroll(event) {
        var sliderCoordsOld = slider.getBoundingClientRect();
        var newTop = event.clientY - scroller.getBoundingClientRect().top - scroller.clientTop - сorrectPick;
        var bottomEdge = sliderFieldHeight - sliderHeight;
        if (arrows == true) {
          bottomEdge += arrowDown.offsetHeight;  
        };
        if (newTop <= topEdge) {
          newTop = topEdge;
        } else if (newTop >= bottomEdge) {
          newTop = bottomEdge;
        };
        slider.style.top = newTop + "px";
        var sliderCoordsNew = slider.getBoundingClientRect();
        var scrollSpeed = (sliderCoordsNew.top - sliderCoordsOld.top) * ratioFactor;
        sliderPick.wrapperY -= scrollSpeed;
        wrapper.style.top = Math.round(sliderPick.wrapperY) + "px";
        if (settings.autoHide == true) {
          adaptiveHide(scroller, scrollerOpacityActive);
          adaptiveHide(plug, scrollerOpacityActive);
        };
        return sliderPick = {
          slider: true,
          wrapperY: sliderPick.wrapperY,
          sliderX: false,
          wrapperX: sliderPick.wrapperX
        };
      };
      sliderScroll(event);
      genericSlidersEvent(event, "Y", sliderScroll);
      return false;
    };
    
    // -- Event "Drag'n Drop" for horizontal slider -- //
    if (horizontalScrolling == true) {
      sliderX.onmousedown = function(event) {
        event = event || window.event;
        var correctPick = event.clientX - sliderX.getBoundingClientRect().left;
        function sliderXScroll(event) {
          var sliderXCoordsOld = sliderX.getBoundingClientRect();
          var newLeft = event.clientX - scrollerX.getBoundingClientRect().left - scrollerX.clientLeft - correctPick;
          var rightEdge = sliderFieldXWidth - sliderWidth;
          if (arrows == true) {
            rightEdge += arrowRight.offsetWidth;
          };
          if (newLeft <= leftEdge) {
            newLeft = leftEdge;
          } else if (newLeft >= rightEdge) {
            newLeft = rightEdge;
          };
          sliderX.style.left = newLeft + "px";
          var sliderXCoordsNew = sliderX.getBoundingClientRect();
          var scrollXSpeed = (sliderXCoordsNew.left - sliderXCoordsOld.left) * ratioFactorX;
          var wrapperPositionXOld = (wrapper.getBoundingClientRect().left - self.getBoundingClientRect().left) - selfPaddingLeft;
          sliderPick.wrapperX -= scrollXSpeed;
          wrapper.style.left = Math.round(sliderPick.wrapperX) + "px";
          if (settings.autoHide == true) {
            adaptiveHide(scrollerX, scrollerOpacityActive);
            adaptiveHide(plug, scrollerOpacityActive);
          };
          return sliderPick = {
            sliderX: true,
            wrapperX: sliderPick.wrapperX,
            slider: false,
            wrapperY: sliderPick.wrapperY
          };
        };
        sliderXScroll(event);
        genericSlidersEvent(event, "X", sliderXScroll);
        return false;
      };
    };
    
    // -- General function of vertical scrolling action for mouse wheel, keyboard and virtual arrows -- //
    function scrollGeneric(event, scrollStep) {
      sliderPick.wrapperY -= scrollStep;
      var newSliderTop = (sliderPick.wrapperY / ratioFactor) * -1;
      if (arrows == true) {
        newSliderTop += arrowUp.offsetHeight;
      };
      var bottomEdge = sliderFieldHeight - sliderHeight;
      if (arrows == true) {
        bottomEdge += arrowDown.offsetHeight;
      };
      if (newSliderTop < topEdge) {
        newSliderTop = topEdge;
        sliderPick.wrapperY = 0;
      } else if (newSliderTop > bottomEdge) {
        newSliderTop = bottomEdge;
        if (horizontalScrolling == true) {
          if (sliderShift == true) {
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPaddingTop + selfPaddingBottom + scrollerX.offsetHeight - (selfBorder.top - selfBorder.bottom)) * -1;
          } else {
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPaddingTop + selfPaddingBottom - (selfBorder.top - selfBorder.bottom)) * -1;
          };
        } else {
          sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPaddingTop + selfPaddingBottom - (selfBorder.top - selfBorder.bottom)) * -1;
        };
      };
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: sliderPick.wrapperY
      };
    };
    
    // -- General function of horizontal scrolling action for keyboard and virtual arrows -- //
    function scrollGenericX(event, scrollStep) {
      sliderPick.wrapperX -= scrollStep;
      var newSliderLeft = (sliderPick.wrapperX / ratioFactorX) * -1;
      if (arrows == true) {
        newSliderLeft += arrowLeft.offsetWidth;
      };
      var rightEdge = sliderFieldXWidth - sliderWidth;
      if (arrows == true) {
        rightEdge += arrowRight.offsetWidth;
      };
      if (newSliderLeft < leftEdge) {
        newSliderLeft = leftEdge;
        sliderPick.wrapperX = 0;
      } else if (newSliderLeft > rightEdge) {
        newSliderLeft = rightEdge;
        if (sliderShift == true) {
          sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPaddingLeft + selfPaddingRight + scroller.offsetWidth - (selfBorder.left - selfBorder.right)) * -1;
        } else {
          sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPaddingLeft + selfPaddingRight - (selfBorder.left - selfBorder.right)) * -1;
        };
      };
      return {
        newSliderLeft: newSliderLeft,
        newWrapperLeft: sliderPick.wrapperX
      };
    };
    
    // -- Event of scrolling by mouse wheel -- //
    if (settings.useWheelScroll == true) {
      // polyfill for event "onwheel"
      function onwheelFixer(elem, func) {
        if (elem.addEventListener) {
          if ('onwheel' in document) {
            // IE9+, FF17+, Ch31+
            elem.addEventListener("wheel", func);
          } else if ('onmousewheel' in document) {
            // old version of "onwheel"
            elem.addEventListener("mousewheel", func);
          } else {
            // Firefox < 17
            elem.addEventListener("MozMousePixelScroll", func);
          };
        } else { // IE8-
          elem.attachEvent("onmousewheel", func);
        };
      };
      // function of scrolling by mouse wheel
      function wheelScroll(event) {
        event = event || window.event;
        var delta = event.deltaY || event.detail || (event.wheelDelta * -1);
        var scrollStep;
        if (delta > 0) {
          scrollStep = stepMultipler;
        } else if (delta < 0) {
          scrollStep = stepMultipler * -1;
        };
        var result = scrollGeneric(event, scrollStep);
        if (settings.autoHide == true) autoHideOnEvents("Y");
        wrapper.style.top = result.newWrapperTop + "px";
        slider.style.top = result.newSliderTop + "px";
      };
      // set event listener
      onwheelFixer(self, wheelScroll);
    };
    
    // -- Event of scrolling by keyboard (wrap event "onkeyboard" in "onfocus" to avoid conflict with native scroller) -- //
    if (settings.useKeyboardScroll == true) {
      self.onfocus = function(event) {
        self.onkeydown = function(event) {
          event = event || window.event;
          
          // -- Vertical scrolling -- //
          function keyboardScroll(event, arrowBtnCode, pageBtnCode, positivity) {
            var scrollStep = 0;
            if (event.keyCode == arrowBtnCode) {
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode == pageBtnCode) {
              if (horizontalScrolling == true) {
                scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
              } else {
                scrollStep = (self.clientHeight) * positivity;
              };
            };
            var result = scrollGeneric(event, scrollStep);
            if (settings.autoHide == true) autoHideOnEvents("Y");
            slider.style.top = result.newSliderTop + "px";
            wrapper.style.top = result.newWrapperTop + "px";
          };
          // condition for bottons "Arrow up" and "Page Up"
          if (event.keyCode == 38 || event.keyCode == 33) {
            keyboardScroll(event, 38, 33, -1);
          };
          // condition for bottons "Arrow down" and "Page Down"
          if (event.keyCode == 40 || event.keyCode == 34) {
            keyboardScroll(event, 40, 34, 1);
          };
          
          // -- Horizontal scrolling -- //
          if (horizontalScrolling == true) {
            function keyboardScrollX(event, arrowBtnCode, pageBtnCode, positivity) {
              var scrollStep = 0;
              if (event.keyCode == arrowBtnCode) {
                scrollStep = stepMultipler * positivity;
              } else if (event.keyCode == pageBtnCode) {
                scrollStep = (self.clientWidth - scroller.offsetWidth) * positivity;
              };
              var result = scrollGenericX(event, scrollStep);
              if (settings.autoHide == true) autoHideOnEvents("X");
              sliderX.style.left = result.newSliderLeft + "px";
              wrapper.style.left = result.newWrapperLeft + "px";
            };
            // condition for bottons "Arrow left" and "Home"
            if (event.keyCode == 37 || event.keyCode == 36) {
              keyboardScrollX(event, 37, 36, -1);
            };
            // condition for bottons "Arrow right" and "End"
            if (event.keyCode == 39 || event.keyCode == 35) {
              keyboardScrollX(event, 39, 35, 1);
            };
          };
        };
      };
    };
    
    // -- Event of scrolling by text selection -- //
    if (settings.scrollBySelection == true) {
      self.onmousedown = function(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        self.focus();
        if (horizontalScrolling == true) {
          if (scroller.contains(target) || scrollerX.contains(target)) return;
          if (sliderPick.slider != false || sliderPick.sliderX != false) return;
        } else {
          if (scroller.contains(target)) return;
          if (sliderPick.slider != false) return;
        };
        
        // -- Vertical scrolling -- //
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
        eventListener('add', document, 'mousemove', selectionScroll);
        eventListener('add', document, 'mouseup', function(event) {
          eventListener('remove', document, 'mousemove', selectionScroll);
        });
        
        // -- Horizontal scrolling -- //
        if (horizontalScrolling == true) {
          function selectionScrollX(event) {
            var scrollStep = 0;
            if (event.clientX < self.getBoundingClientRect().left) {
              scrollStep = stepMultipler * -1;
            } else if (event.clientX > self.getBoundingClientRect().right) {
              scrollStep = stepMultipler;
            };
            var result = scrollGenericX(event, scrollStep);
            wrapper.style.left = result.newWrapperLeft + "px";
            sliderX.style.left = result.newSliderLeft + "px";
          };
          selectionScrollX(event);
          eventListener('add', document, 'mousemove', selectionScrollX);
          eventListener('add', document, 'mouseup', function(event) {
            eventListener('remove', document, 'mousemove', selectionScrollX);
          });
        };
      };
    };
    
    // -- Event of scrolling by click on virtual arrows and empty scroller field (using delegation) -- //
    var loops = {
      looper: undefined,
      repeat: true 
    };
    function virtualScrolling(event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      
      // -- Function for vertical scrolling -- //
      function mouseGeneric(positivity, type) {
        var scrollStep;
        if (type == "Arrow") {
          scrollStep = stepMultipler * positivity;
        } else if (type == "Scroller") {
          if (horizontalScrolling == true) {
            scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
          } else {
            scrollStep = self.clientHeight * positivity;
          };
        };
        var result = scrollGeneric(event, scrollStep);
        slider.style.top = result.newSliderTop + "px";
        wrapper.style.top = result.newWrapperTop + "px";
        if (settings.autoHide == true) autoHideOnEvents("Y");
      };
      
      // -- Function for horizontal scrolling -- //
      if (horizontalScrolling == true) {
        function mouseGenericX(positivity, type) {
          var scrollStep;
          if (type == "Arrow") {
            scrollStep = stepMultipler * positivity;
          } else if (type == "Scroller") {
            scrollStep = (self.clientWidth - scroller.offsetWidth) * positivity;
          };
          var result = scrollGenericX(event, scrollStep);
          sliderX.style.left = result.newSliderLeft + "px";
          wrapper.style.left = result.newWrapperLeft + "px";
          if (settings.autoHide == true) autoHideOnEvents("X");
        };
      };
      
      function loopedMouseGeneric(positivity, type) {
        var looper = setTimeout(function() {
          function repeatAgain() {
            if (loops.repeat == true) {
              var repeater = setTimeout(function() {
                if (scroller.contains(target)) {
                  mouseGeneric(positivity, type);
                } else if (scrollerX.contains(target)) {
                  mouseGenericX(positivity, type);
                };
                repeatAgain();
              }, 50);
            };
          };
          repeatAgain();
        }, 300);
        return loops = {
          looper: looper,
          repeat: true
        };
      };
      
      if (arrows == true) {
        if (arrowUp.contains(target)) { // condition for click on vitrual arrow up
          mouseGeneric(-1, "Arrow");
          loopedMouseGeneric(-1, "Arrow");
        };
        if (arrowDown.contains(target)) { // condition for click on virtual arrow down
          mouseGeneric(1, "Arrow");
          loopedMouseGeneric(1, "Arrow");
        };
        if (horizontalScrolling == true) {
          if (arrowLeft.contains(target)) { // condition for click on vitrual arrow left
            mouseGenericX(-1, "Arrow");
            loopedMouseGeneric(-1, "Arrow");
          };
          if (arrowRight.contains(target)) { // condition for click on virtual arrow right
            mouseGenericX(1, "Arrow");
            loopedMouseGeneric(1, "Arrow");
          }
        };
      };
      
      if (target.getAttribute('data-type') == "scroller") { // condition for click on empty field of vertical scroll bar
        if (event.clientY < slider.getBoundingClientRect().top) {
          mouseGeneric(-1, "Scroller");
          loopedMouseGeneric(-1, "Scroller");
        } else if (event.clientY > slider.getBoundingClientRect().bottom) {
          mouseGeneric(1, "Scroller");
          loopedMouseGeneric(1, "Scroller");
        };
      };
      
      if (horizontalScrolling == true) {
        if (target.getAttribute('data-type') == "scrollerX") { // condition for click on empty field of horizontal scroll bar
          if (event.clientX < sliderX.getBoundingClientRect().left) {
            mouseGenericX(-1, "Scroller");
            loopedMouseGeneric(-1, "Scroller");
          } else if (event.clientX > sliderX.getBoundingClientRect().right) {
            mouseGenericX(1, "Scroller");
            loopedMouseGeneric(1, "Scroller");
          };
        };
      };
      
      return;
    };
    // Stop scrolling function if it run
    function stopVirtualScrolling() {
      if (loops.looper != undefined) {
        clearTimeout(loops.looper);
        loops.repeat = false;
      };
    };
    eventListener('add', scroller, 'mousedown', virtualScrolling);
    eventListener('add', scroller, 'mouseup', stopVirtualScrolling);
    if (horizontalScrolling == true) {
      eventListener('add', scrollerX, 'mousedown', virtualScrolling);
      eventListener('add', scrollerX, 'mouseup', stopVirtualScrolling);
    };
  };
  
  /* Check type of device */
  if(isMobile() == true) {
    self.style.overflowY = "scroll";
  } else {
    generateScroller();
  };
};