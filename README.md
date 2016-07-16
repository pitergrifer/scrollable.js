
scrollable.js by Bogdan Danileichenko (@piter_grifer)

scrollable.js - its prototype for vanilla JavaScript object.
New methood obj.scrollable() can generate custom scroll bar on HTML element.
With scrollable.js you can use you own scrolle, which you can stylezed and
customize the behavior to fit your needs and preferences.

Usege:
1) First you need pick HTML element, which you want add a scroller (for example i use pick by ID):
   var container = document.getElementById('container');

2) Create CSS rules for scroller, arrows (if you want) and slider;

3) Then you must set methood .scrollable() to containter and produce scroller setting:
   container.scrollable({
      scrollerClass: "scroller-field", // CSS-class of scroller (*)
      horizontalScrolling: "auto", // horizontal scrolling presence (flags: "true", "false" or "auto") (*)
      scrollerXClass: "scroller-x-field",
      arrows: true, // arrow presence (flags: "true", "false") (*)
      arrowsClass: "scroller-arrows", // CSS-class of arrows
      arrowChevron: {
        top: "<div class=\"arrow-chevron-top\"></div>",
        bottom: "<div class=\"arrow-chevron-bottom\"></div>",
        left: "<div class=\"arrow-chevron-left\"></div>",
        right: "<div class=\"arrow-chevron-right\"></div>"
      }, // Object with HTML code for arrows chevrons
      sliderClass: "scroller-slider", // CSS-class of slider (*)
      sliderHeight: "auto", // Height of slider ("auto" - calculated based on content; number (without adding "px" or "%") - height in pixels) (*)
      sliderHeightMin: 30, // Minimal height of slider (without adding "px" or "%") (*)
      sliderShift: true, //  Adding shift to content for scroller (flags: "true", "false") (*)
      stepMultipler: 10, // Speed of scrolling (*)
      scrollBySelection: true, // Ability to scroll by text selection (flags: "true", "false") (*)
      useWheelScroll: true, // Ability to scroll by mouse wheel (flags: "true", "false") (*)
      useKeyboardScroll: true, // Ability to scroll by keyboard buttons as "Arrows", "PageUp" and "PageDown" (flags: "true", "false") (*)
      autoHide: true, // Existence of visual effect of hideable scroller (flags: "true", "false") (*)
      scrollerOpacityActive: 1, // Value opacity for active scroller
      scrollerOpacityPassive: 0.6, // Value opacity for passive (semi-hidden) scroller
      scrollerOpacityHidden: 0.4 // Value opacity for hidden scroller
   });
  * - necessary settings