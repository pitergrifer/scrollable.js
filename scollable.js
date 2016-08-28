/*
 * scrollable.js
 *
 * scrollable.js - it`s custom prototype for vanilla JavaScript object.
 * Read README.md form more information and information about usege.
 *
 * Bogdan Danileichenko (@piter_grifer)
 */

Element.prototype.scrollable = function (settings) {
  // -- Polyfill for add/remove events listeners -- //
  function eventListener(action, element, type, func) {
    if (action === "add") { // add event listener
      if (document.addEventListener) { // if it good browser 
        element.addEventListener(type, func);
      } else { // if it retardet IE8 or later
        element.attachEvent("on" + type, func);
      }
    } else if (action === "remove") { // remove event listener
      if (document.removeEventListener) {
        element.removeEventListener(type, func);
      } else {
        element.detachEvent("on" + type, func);
      }
    }
  }
  
  // -- Polyfill for get css-style -- //
  function getStyle(elem) {
    return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
  }
  
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
    }
  }
  
  /* Main function of generation scroller */
  function generateScroller() {
    // -- Function for set default option, if custom undefined -- //
    function setOption(cust, def) {
      if (cust === undefined) {
        return def;
      } else {
        return cust;
      }
    }
    
    // -- Block with main variables -- //
    var verticalScroller = setOption(settings.verticalScroller, true),
      verticalScrollerPrimary = verticalScroller,
      horizontalScroller = setOption(settings.horizontalScroller, true),
      horizontalScrollerPrimary = horizontalScroller,
      scrollerShift = setOption(settings.scrollerShift, true),
      arrows = setOption(settings.arrows, true),
      sliderClass = settings.sliderClass,
      sliderSize = setOption(settings.sliderSize, "auto"),
      stepMultipler = setOption(settings.stepMultipler, 15),
      scrollBySelection = setOption(settings.scrollBySelection, true),
      useWheelScroll = setOption(settings.useWheelScroll, true),
      useKeyboardScroll = setOption(settings.useKeyboardScroll, true),
      dynamicContent = setOption(settings.dynamicContent, false),
      autoHide = setOption(settings.autoHide, true),
      smoothlyScroll = setOption(settings.smoothlyScroll, false);
    
    // set class for scroller and height for slider, if vertical (Y) scroller available
    if (verticalScroller === "auto" || verticalScroller === true) {
      var scrollerYClass = settings.scrollerYClass,
        sliderHeight = sliderSize,
        sliderHeightPrimary = sliderHeight;
    }
    
    // set class for scroller and width for slider, if horizontal (X) scroller available
    if (horizontalScroller === "auto" || horizontalScroller === true) {
      var scrollerXClass = settings.scrollerXClass,
        sliderWidth = sliderSize,
        sliderWidthPrimary = sliderWidth;
    }
    
    // set class for arrows fields and inset HTML-code in there of "chevrones" (yes, you can use Font Awesome), if arrows available
    if (arrows === true) {
      var arrowsClass = settings.arrowsClass,
        arrowChevron = settings.arrowChevron;
    }
    
    // set minimal size for sliders, if sizes are "auto"
    if (sliderSize === "auto") {
      var sliderSizeMin = setOption(settings.sliderSizeMin, 15);
    }
    
    // set states of "auto hide" effect, if it available
    if (autoHide === true) {
      var scrollerOpacityActive = setOption(settings.scrollerOpacityActive, 1),
        scrollerOpacityPassive = setOption(settings.scrollerOpacityPassive, 0.5),
        scrollerOpacityHidden = setOption(settings.scrollerOpacityHidden, 0.2);
    }
    
    // set transition options, if effect of smooth scrolling are active 
    if (smoothlyScroll === true) {
      var smoothlyScrollOptions = setOption(settings.smoothlyScrollOptions, "0.3s top, 0.3s left");
    }
    
    // -- Function for detection <textarea> -- //
    function detectTextArea(elem) {
      // convert data about type of HMTL-element to string and use regV for search "TextArea"
      // P.S. don`t use .toString() function, because IE after convertation return "[object]", instead "[object HTMLTextAreaElement]" (it fucked up at "space")
      if ((elem + "").match(/TextArea/ig)) {
        return true; // HTML-element is <textarea>
      } else {
        return false; // HTML-element is not <textarea>
      }
    }
    
    // -- Detect <textarea> -- //
    var isTextArea = detectTextArea(self);
    
    // -- Function for set width or height for textarea -- //
    function setTextAreaSize(container, size) {
      if (size === "width") {
        return container.clientWidth - parseFloat(getStyle(container).paddingLeft) - parseFloat(getStyle(container).paddingRight);
      } else if (size === "height") {
        return container.clientHeight - parseFloat(getStyle(container).paddingTop) - parseFloat(getStyle(container).paddingBottom);
      }
    }
    
    // -- Logic, if container is <textarea>...</textarea> -- //
    if (isTextArea === true) {
      // create container for textarea, detect some attributes and get primal sizes
      var textAreaContainer = document.createElement("div"),
        textAreaID = self.getAttribute("id"),
        textAreaClass = self.getAttribute("class"),
        textAreaStyle = self.getAttribute("style"),
        textArea = {
          width: self.offsetWidth,
          height: self.offsetHeight
        };
      
      // disable option, which listen changes in content
      if (dynamicContent === true) {
        dynamicContent = false;
      }
      
      // disable option, which gives smooth effect of scrolling
      if (smoothlyScroll === true) {
        smoothlyScroll = false;
      }
      
      // if textarea has "ID" attribute...
      if (textAreaID != undefined) {
        // ...set it to container...
        textAreaContainer.setAttribute("id", textAreaID);
        // ...and remove from textarea
        self.removeAttribute("id");
      }
      
      // if textarea has "Class" attribute...
      if (textAreaClass != undefined) {
        // ...set it to container...
        textAreaContainer.setAttribute("class", textAreaClass);
        // ...and remove from textarea
        self.removeAttribute("class");
      }
      
      // if text area has "Style" attribute...
      if (textAreaStyle != undefined) {
        // ...set it to container...
        textAreaContainer.setAttribute("style", textAreaStyle);
        // ...and remove from textarea
        self.removeAttribute("style");
      }
      
      // insert created container to DOM
      document.body.insertBefore(textAreaContainer, self);
      
      // set sizes, equal to textarea's
      textAreaContainer.style.width = textArea.width + "px";
      textAreaContainer.style.height = textArea.height + "px";
      
      // replace textarea in to container
      textAreaContainer.appendChild(self);
      
      // set attribute for textarea for interaction with it
      self.setAttribute("data-type", "TextArea");
      
      // configurate replaced textarea
      self.style.width = setTextAreaSize(textAreaContainer,"width") + "px";
      self.style.height = setTextAreaSize(textAreaContainer,"height") + "px";
      self.style.margin = "0";
      self.style.padding = "0";
      self.style.font = "inherit";
      self.style.fontFamily = getStyle(textAreaContainer).fontFamily;
      self.style.fontKerning = getStyle(textAreaContainer).fontKerning;
      self.style.fontSize = getStyle(textAreaContainer).fontSize;
      self.style.fontStretch = getStyle(textAreaContainer).fontStretch;
      self.style.fontStyle = getStyle(textAreaContainer).fontStyle;
      self.style.fontVariant = getStyle(textAreaContainer).fontVariant;
      self.style.fontWeight = getStyle(textAreaContainer).fontWeight;
      self.style.hyphens = getStyle(textAreaContainer).hyphens;
      self.style.letterSpacing = getStyle(textAreaContainer).letterSpacing;
      self.style.lineHeight = getStyle(textAreaContainer).lineHeight;
      self.style.tabSize = getStyle(textAreaContainer).tabSize;
      self.style.textAlign = getStyle(textAreaContainer).textAlign;
      self.style.textAlignLast = getStyle(textAreaContainer).textAlignLast;
      self.style.textDecoration = getStyle(textAreaContainer).textDecoration;
      self.style.textDecorationColor = getStyle(textAreaContainer).textDecorationColor;
      self.style.textDecorationLine = getStyle(textAreaContainer).textDecorationLine;
      self.style.textDecorationStyle = getStyle(textAreaContainer).textDecorationStyle;
      self.style.textIndent = getStyle(textAreaContainer).textIndent;
      self.style.textOverflow = getStyle(textAreaContainer).textOverflow;
      self.style.textShadow = getStyle(textAreaContainer).textShadow;
      self.style.textTransform = getStyle(textAreaContainer).textTransform;
      self.style.unicodeBidi = getStyle(textAreaContainer).unicodeBidi;
      self.style.wordSpacing = getStyle(textAreaContainer).wordSpacing;
      self.style.wordBreak = getStyle(textAreaContainer).wordBreak;
      self.style.wordWrap = getStyle(textAreaContainer).wordWrap;
      self.style.whiteSpace = getStyle(textAreaContainer).whiteSpace;
      self.style.border = "none";
      self.style.resize = "none";
      self.style.outline = "none";
      self.style.overflow = "hidden";
      
      // change pointers
      var textAreaBlock = self;
      self = textAreaContainer;
    }
    
    // -- Set attribute "tabindex" at container (it do event "onfocus" available) -- //
    self.setAttribute("tabindex", "99");
    
    // -- Some of elements must have 'data-type' identifier -- //
    self.setAttribute("data-type", "container");
    
    // -- Get borders of container for future calculations -- //
    var selfBorder = {
      top: parseFloat(getStyle(self).borderTopWidth),
      bottom: parseFloat(getStyle(self).borderBottomWidth),
      left: parseFloat(getStyle(self).borderLeftWidth),
      right: parseFloat(getStyle(self).borderRightWidth)
    };
    
    // -- Get paddings of container -- //
    var selfPadding = {
      top: parseFloat(getStyle(self).paddingTop),
      bottom: parseFloat(getStyle(self).paddingBottom),
      left: parseFloat(getStyle(self).paddingLeft),
      right: parseFloat(getStyle(self).paddingRight)
    };
    
    // -- Function of adding standart css propertys -- //
    function makeByStandart(element, parent, position, className) {
      parent.appendChild(element);
      if (className) {
        element.className = className;
      }
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
    }
    
    // -- Function for set/remove effect of smoothly scrolling -- //
    function smoothly(action, element) {
      if (action === "set") { // set case
        element.style.MozTransition = smoothlyScrollOptions;
        element.style.OTransition = smoothlyScrollOptions;
        element.style.WebkitTransition = smoothlyScrollOptions;
        element.style.transition = smoothlyScrollOptions;
      } else if (action === "remove") { // remove case
        element.style.MozTransition = "none";
        element.style.OTransition = "none";
        element.style.WebkitTransition = "none";
        element.style.transition = "none";
      }
    }
    
    // -- Some duplicate actions with options of smooth effect -- //
    function smoothActionPack(action) {
      if (action === "set") { // in case, where need add smooth effect 
        // if vertical scroller exist...
        if (verticalScroller === true) {
          // ...set this effect on it 
          smoothly("set", sliderY);
        }
        
        // if horizontal scroller exist...
        if (horizontalScroller === true) {
          // ...set this effect on it
          smoothly("set", sliderX);
        }
        
        // set this effect on wrapper
        smoothly("set", wrapper);
      } else if (action === "remove") { // in case, where need delete smooth effect
        // if vertical scroller exist...
        if (verticalScroller === true) {
          // ...remove this effect from it
          smoothly("remove", sliderY);
        }
        
        // if horizontal scroller exist...
        if (horizontalScroller === true) {
          // ...remove this effect from it
          smoothly("remove", sliderX);
        }
        
        // remove this effect from wrapper
        smoothly("remove", wrapper);
      }
    }
    
    // -- Function for detection existence of scrollers -- //
    function checkScrollerExistence(axis) {
      if (isTextArea === false) { // detect scrollers at regular block
        if (axis === "Y") { // detect existence of vertical scroller
          if ((self.clientHeight - selfPadding.top - selfPadding.bottom) < wrapper.offsetHeight) { // if content to big...
            // ... activate vertical scroller
            verticalScroller = true;
          } else { // if wrapper can show all content by Y-axis, don`t use vertical scroller
            verticalScroller = false;
          }
        } else if (axis === "X") { // detect existence of horizontal scroller
          if ((self.clientWidth - selfPadding.left - selfPadding.right) < wrapper.offsetWidth) { // if content to big...
            // ... activate horizontal scroller
            horizontalScroller = true;
          } else { // if wrapper can show all content by X-axis, don`t use horizontal scroller
            horizontalScroller = false;
          }
        }
      } else { // detect scrollers ar textarea
        if (axis === "Y") { // detect existence of vertical scroller
          if ((self.clientHeight - selfPadding.top - selfPadding.bottom) < textAreaBlock.scrollHeight) { // if content to big...
            // ... activate vertical scroller
            verticalScroller = true;
          } else { // if wrapper can show all content by Y-axis, don`t use vertical scroller
            verticalScroller = false;
          }
        } else if (axis === "X") { // detect existence of horizontal scroller
          if ((self.clientWidth - selfPadding.left - selfPadding.right) < textAreaBlock.scrollWidth) { // if content to big...
            // ... activate vertical scroller
            horizontalScroller = true;
          } else { // if wrapper can show all content by Y-axis, don`t use vertical scroller
            horizontalScroller = false;
          }
        }
      }
    }
    
    // -- Function for set wrapper width -- //
    function setWrapperWidth(wrapper) {
      if (horizontalScroller === true) { // in case of existance of horizontal scroller
        var wrappedContent = wrapper.children, // create array from all elements in wrapper,.. 
          wrappedContentLength = wrappedContent.length, // ...save length of it
          contentMaxWidth = wrappedContent[0].offsetWidth; // ... and save width of first children
        
        // strat cycle for detect max width of all childrens
        for (var wrapperCounter = 1; wrapperCounter < wrappedContentLength; wrapperCounter++) {
          // update "contentMaxWidth", if current children has width bigger, then previoust
          if (wrappedContent[wrapperCounter].offsetWidth > contentMaxWidth) {
            contentMaxWidth = wrappedContent[wrapperCounter].offsetWidth;
          }
        }
        
        // set new width for wrapper, if content have bigger or smaller size
        if (contentMaxWidth !== wrapper.offsetWidth) {
          wrapper.style.width = contentMaxWidth + "px";
        }
      } else { // case, when horizontal scroller does't exist
        // change wrapper width to "100%", if it value not set already
        if (wrapper.style.width !== "100%") {
          wrapper.style.width = "100%";
        }
      }
    }
    
    // -- Wrap the whole content of the container in div "wrapper" -- //
    if (isTextArea === false) { // ... only, if this it not a textarea
      // save content of container 
      var content = self.innerHTML;
      
      // remove content from container
      self.innerHTML = "";
      
      // create wrapper
      var wrapper = document.createElement("div");
      
      // set standart style settings to wrapper
      makeByStandart(wrapper, self, "relative");
      
      // set attribute to wrapper 
      wrapper.setAttribute("data-type", "wrapper");
      
      // set transition for smooth scrolling effect, if it avalible
      if (smoothlyScroll === true) {
        smoothly("set", wrapper);
      }
      
      // inset HTML-code of conteiner content in to wrapper
      wrapper.innerHTML = content;
      
      // set wrapper width, if horizontal scrolling avalible
      setWrapperWidth(wrapper);
      
      // save wrapper width and height for future calculations
      var wrapperHeight = wrapper.offsetHeight,
        wrapperWidth = wrapper.offsetWidth;
    }
    
    // -- Detect existense of scrollers -- //
    if (dynamicContent === false && isTextArea === false) { // ...in case, when "dynamicContent" option is off 
      // detect existense of vertical scroller
      if (verticalScroller === "auto") { // ...if autodetection is active
        checkScrollerExistence("Y");
      }
      
      // detect existense of horizontal scroller
      if (horizontalScroller === "auto") { // ...if autodetection is active
        checkScrollerExistence("X");
      }
      
      // update wrapper width, if horizontal scrolling avalible
      setWrapperWidth(wrapper);
      
      // save updated wrapper width and height for future calculations
      wrapperHeight = wrapper.offsetHeight,
      wrapperWidth = wrapper.offsetWidth;
    }
    
    // -- Function for creation vertical and horizontal scrollbars -- //
    function makeScroller(axis) {
      // create scroller, as DOM-element
      var scroller = document.createElement("div");
      
      if (axis === "Y") { // case for vertical scroll bar
        // set standart css-properties
        makeByStandart(scroller, self, "absolute", scrollerYClass);
        
        // set attribute at vertical scroller
        scroller.setAttribute("data-type", "scrollerY");
        
        if ((horizontalScroller === "auto") || (horizontalScroller === true)) { // set height for vertical scroller with considering horizontal scroller, if it exist
          scroller.style.height = self.clientHeight - scroller.offsetWidth + "px";
        } else { // set width for vertical scroller without considering horizontal scroller
          scroller.style.height = self.clientHeight + "px";
        }
        
        // grow right padding at container, if option of scroller shift is active active
        if (scrollerShift === true) {
          selfPadding.right += scroller.offsetWidth;
          self.style.paddingRight = selfPadding.right + "px";
          
          // also, change textarea size, if it exist
          if (isTextArea === true) {
            textAreaBlock.style.width = setTextAreaSize(self, "width") + "px";
          }
        }
        
        // set position for vertical scroller
        scroller.style.top = "0px";
        scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
      } else if (axis === "X") { // case for horizontal scrollbar
        // set standart css-properties
        makeByStandart(scroller, self, "absolute", scrollerXClass);
        
        // set attribute at vertical scroller
        scroller.setAttribute("data-type", "scrollerX");
        
        if ((verticalScroller === "auto") || (verticalScroller === true)) { // set width for horizontal scroller with considering vertical scroller width, if it exist
          scroller.style.width = self.clientWidth - scrollerY.offsetWidth + "px";
        } else { // set width for horizontal scroller without considering horizontal scroller height
          scroller.style.width = self.clientWidth + "px";
        }
        
        // grow bottom padding at container, if option of scroller shift is active active
        if (scrollerShift === true) {
          selfPadding.bottom += scroller.offsetHeight;
          self.style.paddingBottom = selfPadding.bottom + "px";
          
          // also, change textarea size, if it exist
          if (isTextArea === true) {
            textAreaBlock.style.height = setTextAreaSize(self, "height")  + "px";
          }
        }
        
        // set position for horizontal scroller
        scroller.style.top = self.clientHeight - scroller.offsetHeight + "px";
        scroller.style.left = "0px";
      }
      
      if (navigator.userAgent.match(/MSIE/ig)) { // fix "blind click" bug in IEs at event onclick on object without background color
        if (getStyle(scroller).backgroundColor === "transparent") { // if scroller background color is transparent (or it doesn't exist)...
          // .., pick container background color, and...
          var parentBackground = getStyle(self).backgroundColor;
          
          if (parentBackground !== "transparent") { // ... if container has background color, set it to scroller
            scroller.style.backgroundColor = parentBackground;
          } else { // ... set white color as background to scroller, if container background color transparent
            scroller.style.backgroundColor = "white";
          }
        }
      }
      
      // set z-index for fix opacity inheritance from parents in IEs 
      scroller.style.zIndex = 1;
      
      // return created element
      return scroller;
    }
    
    // -- Create a vertical scroll bar -- //
    if ((verticalScroller === "auto") || (verticalScroller === true)) {
      var scrollerY = makeScroller("Y"),
        scrollerYPrimalWidth = scrollerY.offsetWidth,
        scrollerYPrimalHeight = scrollerY.offsetHeight;
      
      if (scrollerShift === true) {
        var selfPaddingRightPrimal = selfPadding.right;
      }
    } else {
      var scrollerYPrimalWidth = 0,
        scrollerYPrimalHeight = 0;
    }
    
    // -- Create a horizontal scroll bar -- //
    if ((horizontalScroller === "auto") || (horizontalScroller === true)) {
      var scrollerX = makeScroller("X"),
        scrollerXPrimalWidth = scrollerX.offsetWidth,
        scrollerXPrimalHeight = scrollerX.offsetHeight;
      
      if (scrollerShift === true) {
        var selfPaddingBottomPrimal = selfPadding.bottom;
      }
    } else {
      var scrollerXPrimalWidth = 0,
        scrollerXPrimalHeight = 0;
    }
    
    // -- Create a arrows, if corresponding option activate and at least one of two scrollers are exist -- //
    if (arrows === true && (((verticalScroller === "auto") || (verticalScroller === true)) || ((horizontalScroller === "auto") || (horizontalScroller === true)))) {
      // create arrays for working with cycle 
      var arrowsPack = [],
        chevronPack = [],
        arrowSize;
      
      // set size for arrows, based on scrollers width or height
      if ((verticalScroller === "auto") || (verticalScroller === true)) {
        arrowSize = scrollerY.clientWidth;
      } else if ((horizontalScroller === "auto") || (horizontalScroller === true)) {
        arrowSize = scrollerX.clientHeight;
      }
      
      // create "Up" and "Down" arrows and put it in array, if vertical scroller exist
      if ((verticalScroller === "auto") || (verticalScroller === true)) {
        var arrowUp = document.createElement("div"),
          arrowDown = document.createElement("div");
        arrowsPack.push(arrowUp, arrowDown),
        chevronPack.push(arrowChevron.top, arrowChevron.bottom);
      }
      
      // create "Left" and "Right" arrows and put it in array, if horizontal scroller exist
      if ((horizontalScroller === "auto") || (horizontalScroller === true)) {
        var arrowLeft = document.createElement("div"),
          arrowRight = document.createElement("div");
        arrowsPack.push(arrowLeft, arrowRight);
        chevronPack.push(arrowChevron.left, arrowChevron.right);
      }
      
      // pick count of arrows
      var arrowsCount = arrowsPack.length;
      
      // function with generick action at arrows at all cases
      function generickArrowsOptions(arrowCounter) {
        arrowsPack[arrowCounter].style.width = arrowSize + "px";
        arrowsPack[arrowCounter].style.height = arrowSize + "px";
        arrowsPack[arrowCounter].innerHTML = chevronPack[arrowCounter];
      }
      
      // start cycle, for more compact code
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        if (arrowsCount == 4) { // algorithm, if both scrollers exist
          if (arrowCounter < 2) { // setup "Up" and "Down" arrows by standart, if vertical scroller exist
            makeByStandart(arrowsPack[arrowCounter], scrollerY, "absolute", arrowsClass);
          } else if (arrowCounter >= 2) { // setup "Left" and "Right" arrows by standart, if horizontal scroller exist
            makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
          }
          
          // other generick options
          generickArrowsOptions(arrowCounter);
        } else if (arrowsCount == 2) { // algorithm, if only one scroller exist
          if ((verticalScroller === "auto") || (verticalScroller === true)) { // setup arrows at vertical scroller, if it exist
            makeByStandart(arrowsPack[arrowCounter], scrollerY, "absolute", arrowsClass);
            generickArrowsOptions(arrowCounter);
          }
          
          if ((horizontalScroller === "auto") || (horizontalScroller === true)) { // setup arrows at horizontal scroller, if it exist
            makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
            generickArrowsOptions(arrowCounter);
          }
        }
      }
      
      // positioning "Down" arrow, and get data about margins of walking for slider
      if ((verticalScroller === "auto") || (verticalScroller === true)) {
        var topEdge = arrowUp.offsetWidth,
          sliderFieldY = scrollerY.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight),
          sliderFieldYPrimal = sliderFieldY,
          arrowDownPrimalPosition = scrollerY.clientHeight - arrowDown.offsetHeight;
        
        arrowDown.style.top = scrollerY.clientHeight - arrowDown.offsetHeight + "px";
      }
      
      // positioning "Right" arrow, and get data about margins of walking for slider
      if ((horizontalScroller === "auto") || (horizontalScroller === true)) {
        var leftEdge = arrowLeft.offsetWidth,
          sliderFieldX = scrollerX.clientWidth - (arrowLeft.offsetWidth + arrowRight.offsetWidth),
          sliderFieldXPrimal = sliderFieldX,
          arrowRightPrimalPosition = scrollerX.clientWidth - arrowRight.offsetWidth;
        
        arrowRight.style.left = scrollerX.clientWidth - arrowRight.offsetWidth + "px";
      }
    } else { // get data about margins of walking for slider, if arrows doesn't exist...
      if ((verticalScroller === "auto") || (verticalScroller === true)) { // ...and vertical scroller exist
        var topEdge = 0,
          sliderFieldY = scrollerY.clientHeight,
          sliderFieldYPrimal = sliderFieldY; 
      }
      
      if ((horizontalScroller === "auto") || (horizontalScroller === true)) { // ...and horizontal scroller exist
        var leftEdge = 0,
          sliderFieldX = scrollerX.clientWidth,
          sliderFieldXPrimal = sliderFieldX;
      }
    }
    
    // -- Function for calculate height or width for sliders  -- //
    function setSliderSize(axis) {
      if (axis === "Y") { // algorithm for vertical slider
        if (sliderHeightPrimary === "auto") { // if slider size is "auto", start calculation
          // ratio factor of container and wrapper heights
          var selfWrapperRatioY;
          
          // calculations, considering...
          if (isTextArea === false) { // ... type of object is regular block
            selfWrapperRatioY = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) / 100);
          } else { // ... type of object is textarea
            selfWrapperRatioY = self.clientHeight / ((textAreaBlock.scrollHeight + selfPadding.top + selfPadding.bottom) / 100);
          }
          
          // slider size must be rounded, to prevent fractional numbers
          sliderHeight = Math.round(sliderFieldY / 100 * selfWrapperRatioY);
          
          // slider size cant't be less, then minimal size
          // P.S. if container contain to much content, this case save slider from collapse
          if (sliderHeight < sliderSizeMin) {
            sliderHeight = sliderSizeMin;
          }
        }
        
        // collapse slider, if content occupy not all space of container
        if (sliderHeight >= sliderFieldY) {
          sliderHeight = 0;
        }
        
        // finaly, set calculated size
        sliderY.style.height = sliderHeight + "px";
      } else if (axis === "X") { // algorithm for horizontal slider
        if (sliderWidthPrimary === "auto") {
          // ratio factor of container and wrapper widths
          var selfWrapperRatioX;
          
          // calculations, considering...
          if (isTextArea === false) { // ... type of object is regular block
            selfWrapperRatioX = self.clientWidth / ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) / 100);
          } else { // ... type of object is textarea
            selfWrapperRatioX = self.clientWidth / ((textAreaBlock.scrollWidth + selfPadding.left + selfPadding.right) / 100);
          }
          
          // slider size must be rounded, to prevent fractional numbers
          sliderWidth = Math.round(sliderFieldX / 100 * selfWrapperRatioX);
          
          // slider size cant't be less, then minimal size
          // P.S. if container contain to much content, this case save slider from collapse
          if (sliderWidth < sliderSizeMin) {
            sliderWidth = sliderSizeMin;
          }
        }
        
        // collapse slider, if content occupy not all space of container
        if (sliderWidth >= sliderFieldX) {
          sliderWidth = 0;
        }
        
        // finaly, set calculated size
        sliderX.style.width = sliderWidth + "px";
      }
    }
    
    // -- Function for creation a vertical and horizontal sliders -- //
    function createSlider(axis) {
      // create <div>-element
      var slider = document.createElement("div");
      
      if (axis === "Y") { // case for vertical slider
        // set standart style features
        makeByStandart(slider, scrollerY, "absolute", sliderClass);
        
        // set data-attribute
        slider.setAttribute("data-type", "slider");
        
        // set other style feature
        slider.style.width = scrollerY.clientWidth + "px";
        slider.style.top = topEdge + "px";
      } else if (axis === "X") { // case for horizontal slider
        // set standart style features
        makeByStandart(slider, scrollerX, "absolute", sliderClass);
        
        // set data-attribute
        slider.setAttribute("data-type", "sliderX");
        
        // set other style feature
        slider.style.height = scrollerX.clientHeight + "px";
        slider.style.left = leftEdge + "px";
      }
      
      // set smooth scrolling effect to slider 
      if (smoothlyScroll === true) {
        smoothly("set", slider);
      }
      
      // return computed <div>-element
      return slider;
    }
    
    // -- Create a vertical slider -- //
    if ((verticalScroller === "auto") || (verticalScroller === true)) {
      var sliderY = createSlider("Y");
      
      if (verticalScroller !== "auto") {
        setSliderSize("Y");
      }
    }
    
    // -- Create a horizontal slider -- //
    if ((horizontalScroller === "auto") || (horizontalScroller === true)) {
      var sliderX = createSlider("X");
      
      if (verticalScroller !== "auto") {
        setSliderSize("X");
      }
    }
    
    // -- Insert plug in hole between scrollers -- //
    if (((verticalScroller === "auto") || (verticalScroller === true)) && ((horizontalScroller === "auto") || (horizontalScroller === true))) { // ...if both scrollers exist 
      var plug = document.createElement("div"),
        selfCoords = self.getBoundingClientRect();
      self.appendChild(plug);
      plug.style.position = "absolute";
      plug.style.top = scrollerY.getBoundingClientRect().bottom - selfCoords.top - self.clientTop + "px";
      plug.style.left = scrollerX.getBoundingClientRect().right - selfCoords.left - self.clientLeft + "px";
      plug.style.width = selfCoords.bottom - selfBorder.bottom - scrollerY.getBoundingClientRect().bottom + "px";
      plug.style.height = selfCoords.right - selfBorder.right - scrollerX.getBoundingClientRect().right + "px";
      plug.style.backgroundColor = getStyle(scrollerY).backgroundColor;
      
      var plugPrimalWidth = plug.offsetWidth,
        plugPrimalHeight = plug.offsetHeight;
    } else {
      var plugPrimalWidth = 0,
        plugPrimalHeight = 0;
    }
    
    // -- Function, which change scrollers conditions and do appropriate changes -- //
    function changeScrollersConditions() {
      // check existence of vertical scroller...
      if (verticalScrollerPrimary === "auto") { // ... if it option primary has value "auto" 
        checkScrollerExistence("Y");
      }
      
      // check existence of horizontal scroller...
      if (horizontalScrollerPrimary === "auto") { // ... if it option primary has value "auto"
        checkScrollerExistence("X");
      }
      
      // case, where both scrollers exist
      if ((verticalScroller === true) && (horizontalScroller === true)) {
        // change vertical scroller visibility
        scrollerY.style.width = scrollerYPrimalWidth + "px";
        scrollerY.style.height = scrollerYPrimalHeight + "px";
        scrollerY.style.borderWidth = "1px";
        
        // change horizontal scroller visibility
        scrollerX.style.width = scrollerXPrimalWidth + "px";
        scrollerX.style.height = scrollerXPrimalHeight + "px";
        scrollerX.style.borderWidth = "1px";
        
        // if scroller shift option is on...
        if (scrollerShift === true) {
          // ...change right padding...
          selfPadding.right = selfPaddingRightPrimal;
          self.style.paddingRight = selfPadding.right + "px";
          
          // ...change bottom padding and...
          selfPadding.bottom = selfPaddingBottomPrimal;
          self.style.paddingBottom = selfPadding.bottom + "px";
          
          // ...if we work with textarea... 
          if (isTextArea === true) {
            // ...change it sizes
            textAreaBlock.style.width = setTextAreaSize(self, "width") + "px";
            textAreaBlock.style.height = setTextAreaSize(self, "height") + "px";
          }
        }
        
        // change position of bottom (vertical scroller) and right (horizontal scroller) arrows
        if (arrows === true) {
          arrowDown.style.top = arrowDownPrimalPosition + "px";
          arrowRight.style.left = arrowRightPrimalPosition + "px";
        }
        
        // change info about margins of walking for slider
        sliderFieldY = sliderFieldYPrimal;
        sliderFieldX = sliderFieldXPrimal;
        
        // change sizes of plug
        plug.style.width = plugPrimalWidth + "px";
        plug.style.height = plugPrimalWidth + "px";
      } else if (verticalScroller === true) { // case, where only vertical scroller exist
        // change vertical scroller visibility
        scrollerY.style.width = scrollerYPrimalWidth + "px";
        scrollerY.style.height = scrollerYPrimalHeight + scrollerXPrimalHeight + "px";
        scrollerY.style.borderWidth = "1px";
        
        // change hirizontal scroller visibility...
        if (horizontalScrollerPrimary !== false) { // ...only, if horizontal scroller primary existed
          scrollerX.style.width = scrollerXPrimalWidth + "px";
          scrollerX.style.height = "0px";
          scrollerX.style.borderWidth = "0px";
        }
        
        // if scroller shift option is on...
        if (scrollerShift === true) {
          // ...change right padding...
          selfPadding.right = selfPaddingRightPrimal;
          self.style.paddingRight = selfPadding.right + "px";
          
          // ...change bottom padding, and...
          if (horizontalScrollerPrimary !== false) { // ... only, if if horizontal scroller primary existed
            selfPadding.bottom = selfPaddingBottomPrimal - scrollerXPrimalHeight;
            self.style.paddingBottom = selfPadding.bottom + "px";
          }
          
          // ...if we work with textarea...
          if (isTextArea === true) {
            // ...change it sizes
            textAreaBlock.style.width = setTextAreaSize(self, "width") + "px";
            textAreaBlock.style.height = setTextAreaSize(self, "height") + "px";
          }
        }
        
        // change position of...
        if (arrows === true) {
          // ...bottom arrow and...
          arrowDown.style.top = arrowDownPrimalPosition + plugPrimalHeight + "px";
          
          // ...right arrow...
          if (horizontalScrollerPrimary !== false) { // ... only, if if horizontal scroller primary existed
            arrowRight.style.left = arrowRightPrimalPosition + "px";
          }
        }
        
        // change info about margins of walking by Y-axis for slider
        sliderFieldY = sliderFieldYPrimal + scrollerXPrimalHeight;
        
        // change sizes of plug...
        if ((verticalScrollerPrimary !== false) && (horizontalScrollerPrimary !== false)) { // ...if it exist
          plug.style.width = plugPrimalWidth + "px";
          plug.style.height = "0px";
        }
      } else if (horizontalScroller === true) { // case, where only horizontal scroller exist
        // change vertical scroller visibility
        if (verticalScrollerPrimary !== false) { // ... only, if if vertical scroller primary existed
          scrollerY.style.width = "0px";
          scrollerY.style.height = scrollerYPrimalHeight + "px";
          scrollerY.style.borderWidth = "0px";  
        }
        
        // change horizontal scroller visibility
        scrollerX.style.width = scrollerXPrimalWidth + scrollerYPrimalWidth + "px";
        scrollerX.style.height = scrollerXPrimalHeight + "px";
        scrollerX.style.borderWidth = "1px";
        
        // if scroller shift option is on...
        if (scrollerShift === true) {
          // ...change rigt padding...
          if (verticalScrollerPrimary !== false) { // ... only, if if vertical scroller primary existed
            selfPadding.right = selfPaddingRightPrimal - scrollerYPrimalWidth;
            self.style.paddingRight = selfPadding.right + "px";
          }
          
          // ...change bottom padding, and...
          selfPadding.bottom = selfPaddingBottomPrimal;
          self.style.paddingBottom = selfPadding.bottom + "px";
          
          // ...if we work with textarea...
          if (isTextArea === true) {
            // ...chanfe it sizes
            textAreaBlock.style.width = setTextAreaSize(self, "width") + "px";
            textAreaBlock.style.height = setTextAreaSize(self, "height") + "px";
          }
        }
        
        // if arrows exist, change position...
        if (arrows === true) {
          // ... for bottom arrow...
          if (verticalScrollerPrimary !== false) { // ... only, if if vertical scroller primary existed
            arrowDown.style.top = arrowDownPrimalPosition + "px";
          }
          
          // ... right arrow
          arrowRight.style.left = arrowRightPrimalPosition + plugPrimalWidth + "px";
        }
        
        // change info about margins of walking by X-axis for slider
        sliderFieldX = sliderFieldXPrimal + scrollerYPrimalWidth;
        
        // change plug sizes...
        if ((verticalScrollerPrimary !== false) && (horizontalScrollerPrimary !== false)) { // ...if it exist
          plug.style.width = "0px";
          plug.style.height = plugPrimalHeight + "px";
        }
      } else { // case, where no one scroller exist
        if (verticalScrollerPrimary !== false) { // ... only, if if vertical scroller primary existed
          scrollerY.style.width = "0px";
          scrollerY.style.height = scrollerYPrimalHeight + "px";
          scrollerY.style.borderWidth = "0px";  
        }
        
        if (horizontalScrollerPrimary !== false) { // ... only, if if horizontal scroller primary existed
          scrollerX.style.width = scrollerXPrimalWidth + "px";
          scrollerX.style.height = "0px";
          scrollerX.style.borderWidth = "0px";
        }
        
        // if scroller shift option is on...
        if (scrollerShift === true) {
          // ...change right padding, and...
          if (verticalScrollerPrimary !== false) { // ... only, if if vertical scroller primary existed
            selfPadding.right = selfPaddingRightPrimal - scrollerYPrimalWidth;
            self.style.paddingRight = selfPadding.right + "px";
          }
          
          // ...change bottom padding
          if (horizontalScrollerPrimary !== false) { // ... only, if if horizontal scroller primary existed
            selfPadding.bottom = selfPaddingBottomPrimal - scrollerXPrimalHeight;
            self.style.paddingBottom = selfPadding.bottom + "px";
          }
          
          // ...if we work with textarea...
          if (isTextArea === true) {
            // ...change it sizes
            textAreaBlock.style.width = setTextAreaSize(self, "width") + "px";
            textAreaBlock.style.height = setTextAreaSize(self, "height") + "px";
          }
        }
        
        // change plug sizes...
        if ((verticalScrollerPrimary !== false) && (horizontalScrollerPrimary !== false)) { // ...if it exist
          plug.style.width = "0px";
          plug.style.height = "0px";
        }
      }
    }
    
    if (((dynamicContent === true) || (isTextArea === true)) && ((verticalScrollerPrimary === "auto") || (horizontalScrollerPrimary === "auto"))) {
      changeScrollersConditions();
      
      // calculate vertical slider size
      if (verticalScroller === true) {
        setSliderSize("Y");
      }
      
      // calculate horizontal slider size
      if (horizontalScroller === true) {
        setSliderSize("X");
      }
    }
    
    // -- Function for set "transition" and "opacity" in cross-browser way -- //
    function adaptiveHide(element, value) {
      // transition propertie
      element.style.MozTransition = "opacity, 0.4s"; // old Firefox
      element.style.OTransition = "opacity, 0.4s"; // old Opera
      element.style.WebkitTransition = "opacity, 0.4s"; // old Chrome and other
      element.style.transition = "opacity, 0.4s"; // standart
      
      // opacity propertie
      element.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")\""; // MSIE
      element.style.filter = "alpha(opacity=" + (value * 100) + ")"; // MSIE
      element.style.MozOpacity = value; // old Firefox
      element.style.KhtmlOpacity = value; // old Safari
      element.style.opacity = value; // standart
    }
    
    // -- Adding effect of hideable scroll bar -- //
    if (autoHide === true) {
      // pick id for future timers
      var hideByY,
        hideByX;
      
      // add cross-browser css-properties for vertical scroller in hidden condition 
      if ((verticalScroller === "auto" || verticalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) {
        adaptiveHide(scrollerY, scrollerOpacityHidden);
      }
      
      // add cross-browser css-properties for horizontal scroller in hidden condition 
      if ((horizontalScroller === "auto" || horizontalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) {
        adaptiveHide(scrollerX, scrollerOpacityHidden);
      }
      
      // add cross-browser css-properties for plug in hidden condition 
      if (((verticalScroller === "auto" || verticalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) && ((horizontalScroller === "auto" || horizontalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto"))) {
        adaptiveHide(plug, scrollerOpacityHidden);
      }
      
      // it help us known cursor over the container or not
      var mousePosition = "unknown";
      
      // event, when cursor enter in container
      self.onmouseenter = function (event) {
        // change cross-browser css-properties for vertical scroller to passive (semi-hidden) condition 
        if ((verticalScroller === "auto" || verticalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) {
          adaptiveHide(scrollerY, scrollerOpacityPassive);
        }
        
        // change cross-browser css-properties for horizontal scroller to passive (semi-hidden) condition 
        if ((horizontalScroller === "auto" || horizontalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) {
          adaptiveHide(scrollerX, scrollerOpacityPassive);
        }
        
        // change cross-browser css-properties for plug scroller to passive (semi-hidden) condition 
        if (((verticalScroller === "auto" || verticalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) && ((horizontalScroller === "auto" || horizontalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto"))) {
          adaptiveHide(plug, scrollerOpacityPassive);
        }
        
        // change information about cursor 
        mousePosition = "inside";
      };
      
      // event, when cursor leave container
      self.onmouseleave = function (event) {
        // change cross-browser css-properties for vertical scroller to hidden condition 
        if ((verticalScroller === "auto" || verticalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) {
          adaptiveHide(scrollerY, scrollerOpacityHidden);
        }
        
        // change cross-browser css-properties for horizontal scroller to hidden condition 
        if ((horizontalScroller === "auto" || horizontalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) {
          adaptiveHide(scrollerX, scrollerOpacityHidden);
        }
        
        // change cross-browser css-properties for plug scroller to hidden condition 
        if (((verticalScroller === "auto" || verticalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto")) && ((horizontalScroller === "auto" || horizontalScroller === true) || (isTextArea === true && verticalScrollerPrimary === "auto"))) {
          adaptiveHide(plug, scrollerOpacityHidden);
        }
        
        // change information about cursor 
        mousePosition = "outside";
      };
    }
    
    // -- Function for hiding scrollers at events -- //
    function autoHideOnEvents(axis) {
      if (axis === "Y") { // algorithm for vertical scroller
        // if timer already run, clear it
        if (hideByY != undefined) {
          clearTimeout(hideByY);
        }
        
        // change vertical scroller condition to active, if user interact with it 
        if (verticalScroller === true) {
          adaptiveHide(scrollerY, scrollerOpacityActive);
        }
        
        // change plug condition to active, if user interact with scroller 
        if ((horizontalScroller === true) && (verticalScroller === true))  {
          adaptiveHide(plug, scrollerOpacityActive);
        }
        
        // set timer, which change scrollers condition, if user don`t interact with it... 
        hideByY = setTimeout(function () {
          if (mousePosition === "inside") { // ...in case, where cursor over the container
            // change vertical scroller condition to passive 
            if (verticalScroller === true) {
              adaptiveHide(scrollerY, scrollerOpacityPassive);
            }
            
            // change plug condition to passive
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityPassive);
            }
          } else if (mousePosition === "outside") { // ...in case, where cursor out from the container  
            // change vertical scroller condition to hidden 
            if (verticalScroller === true) {
              adaptiveHide(scrollerY, scrollerOpacityHidden);
            }
            
            // change plug condition to hidden
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityHidden);
            }
          }
        }, 1000);
      } else if (axis === "X") { // algorithm for horizontal scroller
        // if timer already run, clear it
        if (hideByX != undefined) {
          clearTimeout(hideByX);
        }
        
        // change horizontal scroller condition to active, if user interact with it 
        if (horizontalScroller === true) {
          adaptiveHide(scrollerX, scrollerOpacityActive);
        }
        
        // change plug condition to active, if user interact with scroller 
        if ((horizontalScroller === true) && (verticalScroller === true))  {
          adaptiveHide(plug, scrollerOpacityActive);
        }
        
        // set timer, which change scrollers condition, if user don`t interact with it... 
        hideByX = setTimeout(function () {
          if (mousePosition === "inside") { // ...in case, where cursor over the container
            // change horizontal scroller condition to passive 
            if (horizontalScroller === true) {
              adaptiveHide(scrollerX, scrollerOpacityPassive);
            }
            
            // change plug condition to passive
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityPassive);
            }
          } else if (mousePosition === "outside") { // ...in case, where cursor out from the container  
            // change horizontal scroller condition to hidden 
            if (horizontalScroller === true) {
              adaptiveHide(scrollerX, scrollerOpacityHidden);
            }
            
            // change plug condition to hidden
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityHidden);
            }
          }
        }, 1000);
      } 
    }
    
    // -- Ratio factor calculation results -- //
    var ratioFactor = {
      vertical: 0,
      horizontal: 0
    };
    
    // -- Object for detection picked slider -- //
    var sliderPick = {
      sliderY: false,
      sliderX: false,
      wrapperY: 0,
      wrapperX: 0
    };
    
    // -- Ratio factor formula for future calculation -- //
    function calcRatioFactor() {
      // calc ratio factor...
      if (isTextArea === false) { // ... in case, if we work with regular block...
        // ... for vertical scrolling
        if (verticalScroller === true) {
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) - self.clientHeight) / (sliderFieldY - sliderHeight);
        }
        
        // ... for horizontal scrolling
        if (horizontalScroller === true) {
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) - self.clientWidth) / (sliderFieldX - sliderWidth);
        }
      } else { // ... in case, if we work with text area...
        // ... for vertical scrolling
        if (verticalScroller === true) {
          ratioFactor.vertical = (textAreaBlock.scrollHeight - textAreaBlock.offsetHeight) / (sliderFieldY - sliderHeight);
        }
        
        // ... for horizontal scrolling
        if (horizontalScroller === true) {
          ratioFactor.horizontal = (textAreaBlock.scrollWidth - textAreaBlock.offsetWidth) / (sliderFieldX - sliderWidth);
        }
      }
    }
    
    // -- Calculate ratio factor by formula -- //
    calcRatioFactor();
    
    // -- Function for update sliders pisitions in case, where content is dynamic -- // 
    function updateSliderPosition(axis) {
      if (axis === "Y") { // case for vertical slider
        // calculate new position for vertical slider...
        var updatedSliderYTop;
        
        if (isTextArea === false) { // ...if we work with regular block
          updatedSliderYTop = ((wrapper.getBoundingClientRect().top - (self.getBoundingClientRect().top + self.clientTop + selfPadding.top)) / ratioFactor.vertical) * -1;
        } else { // ...if we work with textarea
          updatedSliderYTop = textAreaBlock.scrollTop / ratioFactor.vertical;
          
          // also, update info about scrolled zone
          sliderPick.wrapperY = textAreaBlock.scrollTop * -1;
        }
        
        // prevent wrong position, when slider leave scrollers borders
        if ((updatedSliderYTop + sliderHeight) > sliderFieldY) {
          updatedSliderYTop -= updatedSliderYTop + sliderHeight - sliderFieldY;
          
          // also, fix wrapper position and update info about it
          if (isTextArea === false) {
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
            wrapper.style.top = sliderPick.wrapperY + "px";
          }
        }
        
        // correct pisition, if arrow exist
        if (arrows === true) {
          updatedSliderYTop += arrowUp.offsetHeight;
        }
        
        // set new position
        sliderY.style.top = updatedSliderYTop + "px";
      } else if (axis === "X") { // case for horizontal slider
        // calculate new position for horizontal slider...
        var updatedSliderXLeft;
        
        if (isTextArea === false) { // ...if we work with regular block
          updatedSliderXLeft = ((wrapper.getBoundingClientRect().left - (self.getBoundingClientRect().left + self.clientLeft + selfPadding.left)) / ratioFactor.horizontal) * -1;
        } else { // ...if we work with textarea
          updatedSliderXLeft = textAreaBlock.scrollLeft / ratioFactor.horizontal;
          
          // also, update info about scrolled zone
          sliderPick.wrapperX = textAreaBlock.scrollLeft * -1;
        }
        
        // prevent wrong position, when slider leave scrollers borders
        if ((updatedSliderXLeft + sliderWidth) > sliderFieldX) {
          updatedSliderXLeft -= updatedSliderXLeft + sliderWidth - sliderFieldX;
          
          // also, fix wrapper position
          if (isTextArea === false) {
            sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right) * -1;
            wrapper.style.left = sliderPick.wrapperX + "px";
          }
        }
        
        // correct pisition, if arrow exist
        if (arrows === true) {
          updatedSliderXLeft += arrowLeft.offsetWidth;
        }
        
        // set new position
        sliderX.style.left = updatedSliderXLeft + "px";
      }
    }
    
    // -- Function for autoconfiguration wrapper and sliders, if content is dynamic (infinity scroll, for example) -- //
    function checkContentSize() {
      // set listener on updating content 
      var timerContent = setTimeout(function () {
        // case for vertical scroller
        if ((verticalScrollerPrimary === "auto") || (verticalScrollerPrimary === true)) {
          // if current wrapper height does not equal old value, update it  
          if (wrapper.offsetHeight !== wrapperHeight) {
            wrapperHeight = wrapper.offsetHeight;
            
            // detect scrollers condition
            if (verticalScrollerPrimary === "auto") {
              changeScrollersConditions();
            }
            
            // if vertical scroller exist...
            if (verticalScroller === true) {
              // ...calculate vertical slider size
              setSliderSize("Y");
              
              // ...calculate ratio factor again 
              calcRatioFactor();
              
              // ...set new slider pisition
              updateSliderPosition("Y");
            } else { // ...or change wrapper position to default
              sliderPick.wrapperY = 0;
              wrapper.style.top = "0px";
            }
          }
        }
        
        // case for horizontal scroller
        if ((horizontalScrollerPrimary === "auto") || (horizontalScrollerPrimary === true)) {
          horizontalScroller = true;
          
          // set new wrapper width 
          setWrapperWidth(wrapper);
          
          // if current wrapper width does not equal old value, update it
          if (wrapper.offsetWidth !== wrapperWidth) {
            wrapperWidth = wrapper.offsetWidth;
            
            // detect scrollers condition
            if (horizontalScrollerPrimary === "auto") {
              changeScrollersConditions();
            }
            
            // if horizontal scroller exist...
            if (horizontalScroller === true) {
              // ...calculate horizontal slider size
              setSliderSize("X");
              
              // ...calculate ratio factor again 
              calcRatioFactor();
              
              // ...set new slider pisition
              updateSliderPosition("X");
              
              // ...also, update vertical slider position, if wrappers width changed, but height is same
              if (wrapper.offsetHeight === wrapperHeight && verticalScroller === true) {
                updateSliderPosition("Y");
              }
            } else { // ...or change wrapper position to default
              sliderPick.wrapperX = 0;
              wrapper.style.left = "0px";
            }
          }
        }
        
        // if container is not a textarea, call function again 
        if (isTextArea === false) {
          checkContentSize();
        }
      }, 4);
    }
    
    // -- Call function, which autoconfigurat wrapper and sliders, if content is dynamic -- //
    if ((dynamicContent === true) && (isTextArea === false)) {
      checkContentSize();
    }
    
    // -- Part of code, where sets listeners on updating content of textarea -- //
    if (isTextArea === true) {
      // function, which... 
      function updateTextAreaContent(axis) {
        if (axis === "Y") { // ...in case for Y-axis...
          // ...update vertical slider size...
          setSliderSize("Y");
          
          // ...recalc ratio factor, and...
          calcRatioFactor();
          
          // ...update slider poisition
          updateSliderPosition("Y");
        } else if (axis === "X") { // in case for X-axis...
          // ... update horizontal slider size, ...
          setSliderSize("X");
          
          // ...recalc ratio factor, and...
          calcRatioFactor();
          
          // ...update slider poisition
          updateSliderPosition("X"); 
        }
      }
      
      // object with data about timers, which start and end update content in textarea
      var textAreaTimers = {
        start: undefined,
        run: false,
        end: undefined
      };
      
      // show status of permissibility of scrolling by keyboard
      var activeNavigation = true;
      
      // user can't use keyboard for scrolling, if content is now editing  
      textAreaBlock.onfocus = function () {
        activeNavigation = false;
      }
      
      // update sliders sizes and positions, also ratio factor, when event of scrolling calling
      textAreaBlock.onscroll = function () {
        if ((verticalScrollerPrimary === "auto") || (horizontalScrollerPrimary === "auto")) {
          changeScrollersConditions();
        }
        
        if (verticalScroller === true) {
          updateTextAreaContent("Y");  
        }
        
        if (horizontalScroller === true) {
          updateTextAreaContent("X");
        }
      };
      
      // listener at "keydown" event, which start updating content
      eventListener("add", textAreaBlock, "keydown", function (event) {
        event = event || window.event;
        
        // activate keyboard scrolling, if "Alt" key is pressed
        if (event.keyCode === 45) {
          activeNavigation = true;
        }
        
        // if timer does't exist yet, and pressed key is not controll key...
        if (textAreaTimers.start === undefined) {
          // if timer already run...
          if (textAreaTimers.run === true) {
            clearTimeout(textAreaTimers.end); // ...stop it, ...
            textAreaTimers.end = undefined; // ...stop ending timer to, ...
            textAreaTimers.run = false; // ...and change info about runned timer
          }
          
          // ...start updating content
          textAreaTimers.start = setInterval(function () {
            if ((verticalScrollerPrimary === "auto") || (horizontalScrollerPrimary === "auto")) {
              changeScrollersConditions();
            }
            
            if (verticalScroller === true) {
              updateTextAreaContent("Y");  
            }
            
            if (horizontalScroller === true) {
              updateTextAreaContent("X");
            }
          }, 0);
        }  
      });
      
      // listener at "keyup" event, which ending update content
      eventListener("add", textAreaBlock, "keyup", function (event) {
        event = event || window.event;
        
        // if timer of ending update does't exist yet - start it
        if (textAreaTimers.end === undefined) {
          textAreaTimers.end = setTimeout(function () {
            // remove timer of start updating...
            clearInterval(textAreaTimers.start);
            
            // ...and change info about timers to default...
            textAreaTimers.start = undefined;
            textAreaTimers.end = undefined;
            textAreaTimers.run = false;
          }, 1000); // ...when time is come
        }
        
        // change info abaut runned timer
        textAreaTimers.run = true;  
      });
    }
    
    // -- Generic function for vertical and horozontal sliders -- //
    function genericSlidersEvent(event, axis, sliderMainFunction) {
      // function for prevent selection, while user interact with slider
      function cancelSelection(event) {
        event = event || window.event;
        return false;
      }
      
      // set event listener on "selectstart" event for prevent selection
      eventListener("add", document, "selectstart", cancelSelection);
      
      // set event listener on "mousemove" event for "drag" action with slider  
      eventListener("add", document, "mousemove", sliderMainFunction);
      
      // function for clear events listeners
      function clearEvent() {
        // remove "mousemove", "selectstart", "mouseup" events on document
        eventListener("remove", document, "mousemove", sliderMainFunction);
        eventListener("remove", document, "selectstart", cancelSelection);
        eventListener("remove", document, "mouseup", clearEvent);
        
        // change opacity of scrollers, if option of auto hide effect is on
        if (autoHide === true) {
          if (mousePosition === "inside") { // case, where cursor is over container
            if (axis === "X") { // case for horizontal scroller
              // change horizontal scroller condition to passive, after interaction 
              adaptiveHide(scrollerX, scrollerOpacityPassive);
              
              if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to passive, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityPassive);
              }
            } else if (axis === "Y") { // case for vertical scroller
              // change vertical scroller condition to passive, after interaction 
              adaptiveHide(scrollerY, scrollerOpacityPassive);
              
              if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to passive, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityPassive);
              }
            }
          } else if (mousePosition === "outside") { // case, where cursor is over container
            if (axis === "X") { // case for horizontal scroller
              // change horizontal scroller condition to hidden, after interaction 
              adaptiveHide(scrollerX, scrollerOpacityHidden);
              
              if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to hidden, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityHidden);
              }
            } else if (axis === "Y") { // case for vertical scroller
              // change vertical scroller condition to hidden, after interaction 
              adaptiveHide(scrollerY, scrollerOpacityHidden);
              
              if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to hidden, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityHidden);
              }
            }
          }
        }
        
        // update information about picked slider
        if (axis === "X") { // ...if it horizontal
          sliderPick.sliderX = false;
          
          // activate effect of smooth scrolling again for horizontal slider, if it exist before
          if (smoothlyScroll === true) {
            smoothly("set", sliderX);
          }
        } else if (axis === "Y") { // ...if it vertical
          sliderPick.sliderY = false;
          
          // activate effect of smooth scrolling again for vertical slider, if it exist before
          if (smoothlyScroll === true) {
            smoothly("set", sliderY);
          }
        }
        
        // activate effect of smooth scrolling again for wrapper, if it exist before
        if (smoothlyScroll === true) {
          smoothly("set", wrapper);
        }
      }
      
      // call function, which clear all events, on "mouseup" event
      eventListener("add", document, "mouseup", clearEvent);
    }
    
    // -- Event "Drag'n Drop" for vertical slider -- //
    //if ((verticalScrollerPrimary === "auto") || (verticalScrollerPrimary === true)) {
    if (((dynamicContent === true || isTextArea === true) && (verticalScrollerPrimary === "auto" || verticalScrollerPrimary === true)) || ((dynamicContent === false || isTextArea === false) && (verticalScroller === true))) {
      sliderY.onmousedown = function (event) {
        event = event || window.event;
        
        // stop smooth scrolling effect, while user interact with slider 
        if (smoothlyScroll === true) {
          smoothly("remove", wrapper);
          smoothly("remove", sliderY);
        }
        
        // detect area, where user pick slider, for correct behavior of "D'n D" interation type
        var сorrectPick = event.clientY - sliderY.getBoundingClientRect().top;
        
        // function for moving slider and wrapper
        function sliderYScroll(event) {
          // some variables: 
          var sliderYCoordsOld = sliderY.getBoundingClientRect(), // slider pisition before draging
            newTop = event.clientY - scrollerY.getBoundingClientRect().top - scrollerY.clientTop - сorrectPick, // new position for slider at start of interaction
            bottomEdge = sliderFieldY - sliderHeight; // detect lower allowable position
          
          // change lower allowable position, if arrows exist
          if (arrows === true) {
            bottomEdge += arrowDown.offsetHeight;  
          }
          
          // prevent out of range
          if (newTop <= topEdge) { // if new position out higher allowable position...
            // ...new position must be equal higher allowable position
            newTop = topEdge;
          } else if (newTop >= bottomEdge) { // if new position out lower allowable position...
            // ...new position must be equal lower allowable position
            newTop = bottomEdge;
          }
          
          // set calculated position
          sliderY.style.top = newTop + "px";
          
          // detect new coords of slider...
          var sliderYCoordsNew = sliderY.getBoundingClientRect(),
            scrollSpeed = (sliderYCoordsNew.top - sliderYCoordsOld.top) * ratioFactor.vertical; // and calculate scrolling speed of wrapper
          
          // calculate new position for wrapper
          sliderPick.wrapperY -= scrollSpeed;
          
          // set calculaterd position for wrapper, which give scrolling effect
          if (isTextArea === false) { // ... case, where we work with regular block
            wrapper.style.top = Math.round(sliderPick.wrapperY) + "px";
          } else { // ... case, where we work with textarea
            textAreaBlock.scrollTop = Math.round(sliderPick.wrapperY) * -1;
          }
          
          // change opacity of scrollers, if option of auto hide effect is on 
          if (autoHide === true) {
            // on interaction, change vertical scroller condition to active 
            adaptiveHide(scrollerY, scrollerOpacityActive);
            
            if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
              // on interaction, change plug condition to active
              adaptiveHide(plug, scrollerOpacityActive);
            }
          }
          
          // return data about picked slider and new wrapper position
          return sliderPick = {
            sliderY: true,
            wrapperY: sliderPick.wrapperY,
            sliderX: false,
            wrapperX: sliderPick.wrapperX
          };
        }
        
        // call function for moving slider and content
        sliderYScroll(event);
        
        // call generic actions
        genericSlidersEvent(event, "Y", sliderYScroll);
        
        // prevent default browser event
        return false;
      };
    }
    
    // -- Event "Drag'n Drop" for horizontal slider -- //
    //if ((horizontalScrollerPrimary === "auto") || (horizontalScrollerPrimary === true)) {
    if (((dynamicContent === true || isTextArea === true) && (horizontalScrollerPrimary === "auto" || horizontalScrollerPrimary === true)) || ((dynamicContent === false || isTextArea === false) && (horizontalScroller === true))) {
      sliderX.onmousedown = function (event) {
        event = event || window.event;
        
        // stop smooth scrolling effect, while user interact with slider
        if (smoothlyScroll === true) {
          smoothly("remove", wrapper);
          smoothly("remove", sliderX);
        }
        
        // detect area, where user pick slider, for correct behavior of "D'n D" interation type
        var correctPick = event.clientX - sliderX.getBoundingClientRect().left;
        
        // function for moving slider and content
        function sliderXScroll(event) {
          // some variables: 
          var sliderXCoordsOld = sliderX.getBoundingClientRect(),// slider pisition before draging
            newLeft = event.clientX - scrollerX.getBoundingClientRect().left - scrollerX.clientLeft - correctPick, // new position for slider at start of interaction
            rightEdge = sliderFieldX - sliderWidth; // detect lower allowable position
          
          // change lower allowable position, if arrows exist
          if (arrows === true) {
            rightEdge += arrowRight.offsetWidth;
          }
          
          // prevent out of range
          if (newLeft <= leftEdge) { // if new position out of leftmost allowable position...
            // ...new position must be equal leftmost allowable position
            newLeft = leftEdge;
          } else if (newLeft >= rightEdge) { // if new position out of rightmost allowable position...
            // ...new position must be equal rightmost allowable position
            newLeft = rightEdge;
          }
          
          // set calculated position
          sliderX.style.left = newLeft + "px";
          
          // detect new coords of slider...
          var sliderXCoordsNew = sliderX.getBoundingClientRect(),
            scrollXSpeed = (sliderXCoordsNew.left - sliderXCoordsOld.left) * ratioFactor.horizontal; // and calculate scrolling speed of wrapper
          
          // calculate new position for wrapper
          sliderPick.wrapperX -= scrollXSpeed;
          
          // set calculaterd position for wrapper, which give scrolling effect
          if (isTextArea === false) { // ... case, where we work with regular block
            wrapper.style.left = Math.round(sliderPick.wrapperX) + "px";
          } else { // ... case, where we work with textarea
            textAreaBlock.scrollLeft = Math.round(sliderPick.wrapperX) * -1;
          }
          
          // change opacity of scrollers, if option of auto hide effect is on 
          if (autoHide === true) {
            // on interaction, change vertical scroller condition to active 
            adaptiveHide(scrollerX, scrollerOpacityActive);
              
            if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
              // on interaction, change plug condition to active
              adaptiveHide(plug, scrollerOpacityActive);
            }
          }
          
          // return data about picked slider and new wrapper position
          return sliderPick = {
            sliderX: true,
            wrapperX: sliderPick.wrapperX,
            sliderY: false,
            wrapperY: sliderPick.wrapperY
          };
        }
        
        // call function for moving slider and content
        sliderXScroll(event);
        
        // call generic actions
        genericSlidersEvent(event, "X", sliderXScroll);
        
        // prevent default browser event
        return false;
      };
    }
    
    // -- General function of vertical scrolling action for mouse wheel, keyboard and virtual arrows -- //
    function scrollYGeneric(event, scrollStep) {
      // calculate new position for wrapper
      sliderPick.wrapperY -= scrollStep;
      
      // calculate new slider position
      var newSliderTop = (sliderPick.wrapperY / ratioFactor.vertical) * -1;
      
      // detect lower allowable slider position
      var bottomEdge = sliderFieldY - sliderHeight;
      
      if (arrows === true) { // if arrows exist...
        // ...change slider position
        newSliderTop += arrowUp.offsetHeight;
        
        // ...change lower allowable slider position
        bottomEdge += arrowDown.offsetHeight;
      }
      
      // prevent out of range
      if (newSliderTop < topEdge) { // if new slider position out of higher allowable position...
        // ...new position must be equal higher allowable position
        newSliderTop = topEdge;
        
        // ...and wrapper position must be equal 0
        sliderPick.wrapperY = 0;
      } else if (newSliderTop > bottomEdge) { // if new position out of lower allowable position...
        // ...new position must be equal lower allowable position
        newSliderTop = bottomEdge;
        
        if (isTextArea === false) { // in case, where we work with regular block
          // ...calculate wrapper lower allowable position
          sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
        } else { // in case, where we work with textarea
          // ...detect rightmost allowable scroll value for textarea
          sliderPick.wrapperY = (textAreaBlock.scrollHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
        }
      }
      
      // return data about slider and wrapper positions
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: sliderPick.wrapperY
      };
    }
    
    // -- General function of horizontal scrolling action for keyboard and virtual arrows -- //
    function scrollXGeneric(event, scrollStep) {
      // calculate new position for wrapper
      sliderPick.wrapperX -= scrollStep;
      
      // calculate new slider position
      var newSliderLeft = (sliderPick.wrapperX / ratioFactor.horizontal) * -1;
      
      // detect rightmost allowable slider position
      var rightEdge = sliderFieldX - sliderWidth;
      
      if (arrows === true) { // if arrows exist...
        // ...change slider position
        newSliderLeft += arrowLeft.offsetWidth;
        
        // ...change rightmost allowable slider position
        rightEdge += arrowRight.offsetWidth;
      }
      
      // prevent out of range
      if (newSliderLeft < leftEdge) { // if new slider position out of leftmost allowable position...
        // ...new slider position must be equal leftmost allowable position
        newSliderLeft = leftEdge;
        
        // ...new wrapper position must be equal 0
        sliderPick.wrapperX = 0;
      } else if (newSliderLeft > rightEdge) { // if new slider position out of rightmost allowable position...
        // ...new slider position must be equal leftmost allowable position
        newSliderLeft = rightEdge;
        
        if (isTextArea === false) { // in case, where we work with regular block
          // ...calculate wrapper rightmost allowable position 
          sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right) * -1;
        } else { // in case, where we work with textarea
          // ...detect rightmost allowable scroll value for textarea 
          sliderPick.wrapperX = (textAreaBlock.scrollWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right) * -1;
        }
      }
      
      // return data about slider and wrapper positions
      return {
        newSliderLeft: newSliderLeft,
        newWrapperLeft: sliderPick.wrapperX
      };
    }
    
    // -- Event of scrolling by mouse wheel -- //
    if (useWheelScroll === true) {
      // polyfill for event "onwheel"
      function onwheelFixer(elem, func) {
        if (elem.addEventListener) {
          if ("onwheel" in document) {
            // IE9+, FF17+, Ch31+
            elem.addEventListener("wheel", func);
          } else if ("onmousewheel" in document) {
            // old version of "onwheel"
            elem.addEventListener("mousewheel", func);
          } else {
            // Firefox < 17
            elem.addEventListener("MozMousePixelScroll", func);
          }
        } else { // IE8-
          elem.attachEvent("onmousewheel", func);
        }
      }
      
      // function of scrolling by mouse wheel
      function wheelScroll(event) {
        event = event || window.event;
        
        // detect cross-browser delta 
        var delta = event.deltaY || event.detail || (event.wheelDelta * -1),
          scrollStep;
        
        // set scroll step as...
        if (delta > 0) { // ...positive number
          scrollStep = stepMultipler;
        } else if (delta < 0) { // ... negative number
          scrollStep = stepMultipler * -1;
        }
        
        if (verticalScroller !== true && horizontalScroller === true) { // scroll by X-axis, if vertical scroller does't exist
          // change vertical scroller opacity condition 
          if (autoHide === true) {
            autoHideOnEvents("X");
          }
          
          // calculate new positions for vertical slider and wrapper 
          var result = scrollXGeneric(event, scrollStep);
          
          // set new positions for slider  
          sliderX.style.left = result.newSliderLeft + "px";
          
          if (isTextArea === false) { // if we work with regular block...
            // ...set new position for wrapper
            wrapper.style.left = result.newWrapperLeft + "px";
          } else { // if we work with textarea...
            // ...scroll textarea by changing scrollLeft value
            textAreaBlock.scrollLeft = result.newWrapperLeft * -1;
          }
        } else if (verticalScroller === true) { // scroll by Y-axis, if vertical scroller exist
          // change vertical scroller opacity condition 
          if (autoHide === true) {
            autoHideOnEvents("Y");
          }
          
          // calculate new positions for vertical slider and wrapper 
          var result = scrollYGeneric(event, scrollStep);
          
          // set new positions for slider  
          sliderY.style.top = result.newSliderTop + "px";
          
          if (isTextArea === false) { // if we work with regular block...
            // ...set new position for wrapper
            wrapper.style.top = result.newWrapperTop + "px";  
          } else { // if we work with textarea...
            // ...scroll textarea by changing scrollLeft value
            textAreaBlock.scrollTop = result.newWrapperTop * -1;
          }
        }
      }
      
      // set event listener
      onwheelFixer(self, wheelScroll);
    };
    
    // -- Function, which return transition duration in ms -- //
    function getTransitionDurationMs() {
      var durationInSeconds = parseFloat(wrapper.style.transitionDuration) ||
        parseFloat(wrapper.style.WebkitTransitionDuration) ||
        parseFloat(wrapper.style.MozTransitionDuration) ||
        parseFloat(wrapper.style.OTransitionDuration);
      return durationInSeconds * 1000;
    }
    
    // -- If smooth effect on scrolling is on... -- //
    if (smoothlyScroll === true) {
      var transitionDuration = getTransitionDurationMs(), // ...get time of transition
        removeSmoothTimer = "empty"; // ...set ID for future timer
    }
    
    // -- Event of scrolling by keyboard (wrap event "onkey..." in "onfocus" to avoid conflict with native scroller) -- //
    self.onfocus = function (event) {
      if (useKeyboardScroll === true) {
        // activate navigation, at textarea
        if (isTextArea === true) {
          activeNavigation = true;
        }
        
        // set events listener on "keydown" event
        self.onkeydown = function (event) {
          event = event || window.event;
          
          // function, which freez smooth effect, when key pressed a long time
          function freezTransition(axis) {
            // perform function, if effect of smooth scrolling is active and timer does't already run
            if ((smoothlyScroll === true) && (removeSmoothTimer === "empty"))  {
              // start freezing, after complete first iteration of smooth action (it`s transition duration)
              removeSmoothTimer = setTimeout(function() {
                 // stop smooth effect...
                if (axis === "Y") { // ...on vertical slider, ...
                  smoothly("remove", sliderY);  
                } else if (axis == "X") { // ...or horizontal slider, ... 
                  smoothly("remove", sliderX);
                }
                // ... and wrapper
                smoothly("remove", wrapper);
              }, transitionDuration);
            }
          }
          
          // function of vertical scrolling by keys 
          function keyboardScrollY(event, arrowBtnCode, pageBtnCode, positivity) {
            // set scroll step for next calculation
            var scrollStep = 0;
            
            // calculate scroll step...
            if (event.keyCode === arrowBtnCode) { // ...if it one of "Arrow" keys  
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode === pageBtnCode) { // ...if it one of "Page" keys
              if (horizontalScroller === true) { // in case, where horizontal scroller exist
                scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
              } else { // in case without horizontal scroller
                scrollStep = (self.clientHeight) * positivity;
              }
            }
            
            // freez smooth effect
            freezTransition("Y");
            
            // change opacity condition for vertical scroller
            if (autoHide === true) {
              autoHideOnEvents("Y");
            }
            
            // calculate new positions for wrapper and slider
            var result = scrollYGeneric(event, scrollStep);
            
            // set at slider calculated positions
            sliderY.style.top = result.newSliderTop + "px";
            
            if (isTextArea === false) { // if we work with textarea...
              // ... set calculated position at wrapper
              wrapper.style.top = result.newWrapperTop + "px";
            } else { // if we work with regular block...
              // ... scroll textarea by changing scrollTop value
              textAreaBlock.scrollTop = result.newWrapperTop * -1;
            }
          } 
          
          // function of vertical scrolling by keys
          function keyboardScrollX(event, arrowBtnCode, pageBtnCode, positivity) {
            // set scroll step for next calculation
            var scrollStep = 0;
            
            // calculate scroll step...
            if (event.keyCode === arrowBtnCode) { // ...if it one of "Arrow" keys  
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode === pageBtnCode) { // ...if it one of "Page" keys
              if (verticalScroller === true) { // in case, where vertical scroller exist
                scrollStep = (self.clientWidth - scrollerY.offsetWidth) * positivity;
              } else { // in case without vertical scroller
                scrollStep = self.clientWidth * positivity;
              }
            }
            
            // freez smooth effect
            freezTransition("X");
            
            // change opacity condition for horizontal scroller
            if (autoHide === true) {
              autoHideOnEvents("X");
            }
            
            // calculate new positions for wrapper and slider
            var result = scrollXGeneric(event, scrollStep);
            
            // set at slider calculated positions
            sliderX.style.left = result.newSliderLeft + "px";
            
            if (isTextArea === false) {
              wrapper.style.left = result.newWrapperLeft + "px";
            } else {
              textAreaBlock.scrollLeft = result.newWrapperLeft * -1;
            }
          }
          
          // condition for bottons "Arrow up" and "Page Up"
          if ((event.keyCode == 38 || event.keyCode == 33) && (sliderHeight > 0) && ((verticalScrollerPrimary === "auto") || (verticalScrollerPrimary === true))) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollY(event, 38, 33, -1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollY(event, 38, 33, -1);
            }
          }
          
          // condition for bottons "Arrow down" and "Page Down"
          if ((event.keyCode == 40 || event.keyCode == 34) && (sliderHeight > 0) && ((verticalScrollerPrimary === "auto") || (verticalScrollerPrimary === true))) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollY(event, 40, 34, 1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollY(event, 40, 34, 1);
            }
          }
          
          // condition for bottons "Arrow left" and "Home"
          if ((event.keyCode == 37 || event.keyCode == 36) && (sliderWidth > 0) && ((horizontalScrollerPrimary === "auto") || (horizontalScrollerPrimary === true))) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollX(event, 37, 36, -1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollX(event, 37, 36, -1);
            }
          }
          
          // condition for bottons "Arrow right" and "End"
          if ((event.keyCode == 39 || event.keyCode == 35) && (sliderWidth > 0) && ((horizontalScrollerPrimary === "auto") || (horizontalScrollerPrimary === true))) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollX(event, 39, 35, 1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollX(event, 39, 35, 1);
            }
          }
          
          // if effect of smooth scrolling is on...
          if (smoothlyScroll === true) { // ...set event listener on "keyup", which...
            self.onkeyup = function () {
              // ... clear timer, which delay freezing...
              clearTimeout(removeSmoothTimer);
              removeSmoothTimer = "empty";
              
              // ...and set smooth effect again
              smoothActionPack("set");
            };
          }
        };
      }
    };
    
    /*
    // -- Function, which set focus at textarea at some cases -- //
    function setFocusOnTextArea(event) {
      event = event || window.event;
      
      // get cross-browser "target" element
      var target = event.target || event.srcElement;
      
      // set focus
      if (isTextArea === true) { // if we work with textarea...
        // ...get container coords
        var selfCoords = self.getBoundingClientRect();
        
        // ...get coords of empty zone in container
        var emptyContainerZone = {
          top: textAreaBlock.getBoundingClientRect().bottom,
          left: selfCoords.left + self.clientLeft
        };
        
        // ...calculate right edge of this zone...
        if (verticalScroller === true) { // ...if vertical scroller exist
          emptyContainerZone.right = scrollerY.getBoundingClientRect().left;
        } else { // ...if vertical scroller does`t exist
          emptyContainerZone.right = selfCoords.right - parseFloat(getStyle(self).borderRightWidth);
        }
        
        // ...calculate bottom edge of this zone...
        if (horizontalScroller === true) { // ...if horizontal scroller exist
          emptyContainerZone.bottom = scrollerX.getBoundingClientRect().top;
        } else {  // ...if horizontal scroller does`t exist
          emptyContainerZone.bottom = selfCoords.bottom - parseFloat(getStyle(self).borderBottomWidth);
        }
        
        // ...set focus to...
        if (((event.clientY >= emptyContainerZone.top) && (event.clientY <= emptyContainerZone.bottom)) && ((event.clientX >= emptyContainerZone.left) && (event.clientX <= emptyContainerZone.right))) {
          // ...textarea, if user click on empty zone of container...
          textAreaBlock.focus();
          
          // ...and prevent native scroll for fix issues at some browsers
          preventNativeScroll();
        }
      }
    }
    
    
    // -- Use previous function on "click" event at container -- //
    if (isTextArea === true) {
      eventListener("add", self, "click", setFocusOnTextArea);
    }
    */
    
    // -- Event of scrolling by text selection -- //
    if (scrollBySelection === true) {
      self.onmousedown = function (event) {
        event = event || window.event;
        
        // get cross-browser "target" element
        var target = event.target || event.srcElement;
        
        if (target.getAttribute("data-type") !== "TextArea") {
          self.focus();
        }
        
        // prevent event, if... 
        // ... vertical scroller exist, and...
        if (verticalScroller === true) {
          // ...it contanis target
          if (scrollerY.contains(target)) {
            return;
          }
          
          // ...user interact with slider
          if (sliderPick.sliderY != false) {
            return; 
          }
        }
        
        // ... vertical scroller exist, and...
        if (horizontalScroller === true) {
          // ...it contanis target
          if (scrollerX.contains(target)) {
            return;
          }
          
          // ...user interact with slider
          if (sliderPick.sliderX != false) {
            return; 
          }
        }
        
        // remove smooth effect, while scrolling
        if (smoothlyScroll === true) {
          smoothActionPack("remove");
        }
        
        // function of vertical scrolling by text selection
        function selectionScrollY(event) {
          // set scroll step for future calculation
          var scrollStep = 0;
          
          // calculate scroll step...
          if (event.clientY < self.getBoundingClientRect().top) { // ...if cursor over the top of container
            scrollStep = stepMultipler * -1;
          } else if (event.clientY > self.getBoundingClientRect().bottom) { // ...if cursor under the bottom of container
            scrollStep = stepMultipler;
          }
          
          // calculate new positions for wrapper and vertical slider
          var result = scrollYGeneric(event, scrollStep);
          
          // set calculated positions to vertical slider
          sliderY.style.top = result.newSliderTop + "px";
          
          if (isTextArea === false) { // if we work with regular block...
            // ...set calculated positions to wrapper
            wrapper.style.top = result.newWrapperTop + "px";
          } else { // if we work with textarea...
            // ...scroll textarea by chenging scrollTop value
            textAreaBlock.scrollTop = result.newWrapperTop * -1;
          }
        }
        
        // function of horizontal scrolling by text selection
        function selectionScrollX(event) {
          // set scroll step for future calculation
          var scrollStep = 0;
          
          // calculate scroll step...
          if (event.clientX < self.getBoundingClientRect().left) { // ...if cursor came out the left side of container
            scrollStep = stepMultipler * -1;
          } else if (event.clientX > self.getBoundingClientRect().right) { // ...if cursor came out the right side of container
            scrollStep = stepMultipler;
          };
          
          // calculate new positions for wrapper and horizontal slider
          var result = scrollXGeneric(event, scrollStep);
          
          // set calculated positions for wrapper and horizontal slider
          sliderX.style.left = result.newSliderLeft + "px";
          
          if (isTextArea === false) { // if we work with regular block...
            // ...set calculated positions to wrapper
            wrapper.style.left = result.newWrapperLeft + "px";
          } else { // if we work with textarea...
            // ...scroll textarea by chenging scrollLeft value
            textAreaBlock.scrollLeft = result.newWrapperLeft * -1;
          }
        }
        
        checkScrollerExistence("X");
        
        // case of vertical scrolling
        if (verticalScroller === true) {
          // call function of vertical scrolling by text selection
          selectionScrollY(event);
          
          // set event listener on "mousemove" event
          eventListener("add", document, "mousemove", selectionScrollY);
          
          // set listener, which...
          eventListener("add", document, "mouseup", function(event) {
            // ...clear listener of "mousemove" event and...
            eventListener("remove", document, "mousemove", selectionScrollY);
            // ...return smooth effect back again
            if (smoothlyScroll === true) { 
              smoothActionPack("set");
            }
          });
        }
        
        // case of horizontal scrolling
        if (horizontalScroller === true) {
          // call function of horizontal scrolling by text selection
          selectionScrollX(event);
          
          // set event listener on "mousemove" event
          eventListener("add", document, "mousemove", selectionScrollX);
          
          // set listener, which...
          eventListener("add", document, "mouseup", function(event) {
            // ...clear listener of "mousemove" event and...
            eventListener("remove", document, "mousemove", selectionScrollX);
            // ...return smooth effect back again
            if (smoothlyScroll === true) {
              smoothActionPack("set");
            }
          });
        }
      };
    }
    
    // -- Event of scrolling by click on virtual arrows and empty scroller field (using delegation) -- //
    // object with info about loops for emulated "press/hold" event on virtual control elements 
    var loops = {
      looper: undefined,
      repeat: true 
    };
    
    // function of scrolling by virtual arrows and clicking on scroller
    function virtualScrolling(event) {
      event = event || window.event;
      
      // cross-browser target
      var target = event.target || event.srcElement;
      
      // function of vertical scrolling
      function mouseGenericY(positivity, type) {
        // set scroll step for next calculations
        var scrollStep;
        
        // calculate scroll step...
        if (type === "Arrow") { // ...in case for arrows 
          scrollStep = stepMultipler * positivity;
        } else if (type === "Scroller") { // ...in case for scroller...
          if (horizontalScroller === true) { // ...if horizontal scroller exist
            scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
          } else { // ...if horizontal scroller does't exist
            scrollStep = self.clientHeight * positivity;
          }
        }
        
        // change opacity condition of active controll elements
        if (autoHide === true) {
          autoHideOnEvents("Y");
        }
        
        // calculate new positions for vertical slider and wrapper
        var result = scrollYGeneric(event, scrollStep);
        
        // set calculated position to vertical slider
        sliderY.style.top = result.newSliderTop + "px";
        
        if (isTextArea === false) { // if we work with regular block..
          // ...set calculated position to wrapper
          wrapper.style.top = result.newWrapperTop + "px";
        } else { // if we work with textarea..
          // ...scroll textarea by chenging scrollLeft value
          textAreaBlock.scrollTop = result.newWrapperTop * -1;
        }
      }
      
      // function of horizontal scrolling
      function mouseGenericX(positivity, type) {
        // set scroll step for next calculations
        var scrollStep;
        
        // calculate scroll step...
        if (type === "Arrow") { // ...in case for arrows 
          scrollStep = stepMultipler * positivity;
        } else if (type === "Scroller") { // ...in case for scroller...
          if (verticalScroller === true) { // ...if horizontal scroller exist
            scrollStep = (self.clientWidth - scrollerY.offsetWidth) * positivity;
          } else { // ...if horizontal scroller does't exist
            scrollStep = self.clientWidth * positivity;
          }
        }
        
        // change opacity condition of active controll elements
        if (autoHide === true) {
          autoHideOnEvents("X");
        }
        
        // calculate new positions for horizontal slider and wrapper
        var result = scrollXGeneric(event, scrollStep);
        
        // set calculated position to horizontal slider
        sliderX.style.left = result.newSliderLeft + "px";
        
        if (isTextArea === false) { // if we work with regular block...
          // ...set calculated position to wrapper
          wrapper.style.left = result.newWrapperLeft + "px";
        } else { // if we work with textarea...
          // ...scroll textarea by chenging scrollLeft value
          textAreaBlock.scrollLeft = result.newWrapperLeft * -1;
        }
      }
      
      // function, which emulated "press/hold" behavior on virtual controlls elements
      function loopedMouseGeneric(positivity, type) {
        // start loop, if user hold virtual key to long
        var looper = setTimeout(function() {
          // remove effect of smooth scrolling
          if (smoothlyScroll === true) {
            smoothActionPack("remove");
          }
          
          // repeat same action again, ...
          function repeatAgain() {
            if (loops.repeat === true) { // ...while user hold virtual key...
              var repeater = setTimeout(function() {
                if ((verticalScroller === true) && (scrollerY.contains(target))) { // ...in case where it vertical scroller
                  mouseGenericY(positivity, type);
                } else if ((horizontalScroller === true) && (scrollerX.contains(target))) { // ...in case where it horizontal scroller
                  mouseGenericX(positivity, type);
                }
                
                // recursion of it function
                repeatAgain();
              }, 30);
            }
          }
          
          // call function, which repeat scrolling action
          repeatAgain();
        }, 300);
        
        // return data about conditions of loops
        return loops = {
          looper: looper,
          repeat: true
        };
      }
      
      // use scrolling by virtual arrows, if it exist
      if (arrows === true) {
        if ((verticalScroller === true) && (sliderHeight > 0)) { // case for vertical scroller
          if (arrowUp.contains(target)) { // condition for click on vitrual "Arrow up"
            // standart scroll action
            mouseGenericY(-1, "Arrow");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(-1, "Arrow");
          }
          
          if (arrowDown.contains(target)) { // condition for click on virtual "Arrow down"
            // standart scroll action
            mouseGenericY(1, "Arrow");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(1, "Arrow");
          }
        }
        
        if ((horizontalScroller === true) && (sliderWidth > 0)) { // case for horizontal scroller
          if (arrowLeft.contains(target)) { // condition for click on vitrual "Arrow left"
            // standart scroll action
            mouseGenericX(-1, "Arrow");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(-1, "Arrow");
          }
          
          if (arrowRight.contains(target)) { // condition for click on virtual "Arrow right"
            // standart scroll action
            mouseGenericX(1, "Arrow");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(1, "Arrow");
          }
        }
      }
      
      // condition for click on empty field of vertical scroll bar
      if (verticalScroller === true) {
        if ((target.getAttribute("data-type") === "scrollerY") && (sliderHeight > 0)) {
          if (event.clientY < sliderY.getBoundingClientRect().top) { // case, if user click above slider
            // standart scroll action
            mouseGenericY(-1, "Scroller");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(-1, "Scroller");
          } else if (event.clientY > sliderY.getBoundingClientRect().bottom) { // case, if user click under slider
            // standart scroll action
            mouseGenericY(1, "Scroller");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(1, "Scroller");
          }
        }
      }
      
      // condition for click on empty field of horizontal scroll bar
      if (horizontalScroller === true) {
        if ((target.getAttribute("data-type") === "scrollerX") && (sliderWidth > 0)) {
          if (event.clientX < sliderX.getBoundingClientRect().left) { // case, if user click to the left of slider
            // standart scroll action
            mouseGenericX(-1, "Scroller");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(-1, "Scroller");
          } else if (event.clientX > sliderX.getBoundingClientRect().right) { // case, if user click to the right of slider
            // standart scroll action
            mouseGenericX(1, "Scroller");
            // looped scroll action, if user hold it virtual key
            loopedMouseGeneric(1, "Scroller");
          }
        }
      }
      
      // prevent default browser event
      return false;
    }
    
    // stop scrolling function if it run
    function stopVirtualScrolling() {
      if (loops.looper != undefined) {
        // remove runned timer
        clearTimeout(loops.looper);
        
        // stop repeating action
        loops.repeat = false;
        
        // set smooth effect again
        if (smoothlyScroll === true) {
          smoothActionPack("set");
        }
      }
    }
    
    // set event listeners for...
    if (((dynamicContent === true || isTextArea === true) && (verticalScrollerPrimary === "auto" || verticalScrollerPrimary === true)) || ((dynamicContent === false || isTextArea === false) && (verticalScroller === true))) {
      // listener of "mousedown" event, which scrolling and run loops
      eventListener("add", scrollerY, "mousedown", virtualScrolling);
      // listener of "mouseup" event, which stop all loops
      eventListener("add", scrollerY, "mouseup", stopVirtualScrolling);
    }
    
    if (((dynamicContent === true || isTextArea === true) && (horizontalScrollerPrimary === "auto" || horizontalScrollerPrimary === true)) || ((dynamicContent === false || isTextArea === false) && (horizontalScroller === true))) {
      // listener of "mousedown" event, which scrolling and run loops
      eventListener("add", scrollerX, "mousedown", virtualScrolling);
      // listener of "mouseup" event, which stop all loops
      eventListener("add", scrollerX, "mouseup", stopVirtualScrolling);
    }
  }
  
  /* Check type of device */
  if (isMobile() === true) { // use default scroller, if it mobile device
    self.style.overflowY = "scroll";
  } else { // use custom scroller, if it desktop
    generateScroller();
  }
};