
# scrollable.js by Bogdan Danileichenko (@piter_grifer)

## About
scrollable.js - its prototype for JavaScript object.
New methood obj.scrollable() can generate custom scrollbar on HTML element.
With scrollable.js you can use you own scrolle, which you can stylezed and
customize the behavior to fit your needs and preferences.

## Usege
<ol start="1">
<li>One, create <strong>CSS rules</strong> for scroller, arrows (if you want) and slider (some css-rules will be redefined by plugin logic):</li>
</ol>
```css
   #container {
     position: relative;
     display: block;
     box-sizing: border-box;
     width: 500px;
     height: 700px;
     margin-left: auto;
     margin-right: auto;
     padding: 15px;
     border: 16px solid black;
     border-right: 1px solid black;
     border-bottom: 1px solid black;
     overflow: hidden;
   }
   
   .scroller-field, .scroller-x-field {
     position: absolute;
     display: block;
     width: 17px;
     background-color: black;
   }
   
   .scroller-field {
     border-left: 1px solid black;
   }
   
   .scroller-x-field {
     border-top: 1px solid black;
   }
   
   .scroller-arrows {
     position: absolute;
     display: block;
     background-color: black;
     cursor: pointer;
   }
   
   .arrow-chevron-top,
   .arrow-chevron-bottom,
   .arrow-chevron-left,
   .arrow-chevron-right {
     position: relative;
     display: block;
     width: 0px;
     height: 0px;
   }
   
   .arrow-chevron-top {
     border-top: 8px solid transparent;
     border-right: 8px solid transparent;
     border-bottom: 8px solid orange;
     border-left: 8px solid transparent;
   }
   
   .arrow-chevron-bottom {
     border-top: 8px solid orange;
     border-right: 8px solid transparent;
     border-bottom: 8px solid transparent;
     border-left: 8px solid transparent;
   }
   
   .arrow-chevron-left {
     border-top: 8px solid transparent;
     border-right: 8px solid orange;
     border-bottom: 8px solid transparent;
     border-left: 8px solid transparent;
   }
   
   .arrow-chevron-right {
     border-top: 8px solid transparent;
     border-right: 8px solid transparent;
     border-bottom: 8px solid transparent;
     border-left: 8px solid orange;
   }
   
   .scroller-slider {
     position: absolute;
     display: block;
     background-color: orange;
   }
```
</ol>
<ol start="2">
<li>After that, you need pick <strong>HTML element</strong>, which you want add a scroller (for example i use pick by ID):</li>
</ol>
```javascript
   var container = document.getElementById('container');
```
<ol start="3">
<li>Then you must <strong>set methood .scrollable()</strong> to containter and produce scroller setting:
<ul>
<li><strong>"scrollerClass"</strong> - CSS-class of vertical scroller. Also, this class use in horizontal scroll bar as main. Necessary setting;</li>
<li><strong>"horizontalScrolling"</strong> - horizontal scrolling presence. Flags: "true", "false" or "auto". In "auto" flag horizontal scrolling avalible only if content width larger, then width of container;</li>
<li><strong>"scrollerXClass"</strong> - CSS-class of horizontal scroller. This class may only adjust a main "scrollerClass". Not necessary setting, if you don't use horizontal scrolling;</li>
<li><strong>"arrows"</strong> - arrows presence. Flags: "true", "false". Necessary setting;</li>
<li><strong>"arrowsClass"</strong> - CSS-class of arrows. Not necessary setting, if you don't use arrows;</li>
<li><strong>"arrowChevron"</strong> - Object with HTML code for arrows chevrons. Keys: "top", "bottom", "left", "right" for top, bottom, left and right arrows respectively. Not necessary setting, if you don't use arrows;</li>
<li><strong>"sliderClass"</strong> - CSS-class of slider. Necessary setting;</li>
<li><strong>sliderHeight</strong> - height of slider. Flags: "auto" - calculated based on content; number (without adding "px" or "%") - height in pixels. Necessary setting;</li>
<li><strong>"sliderHeightMin"</strong> - minimal height of slider. Flag: number (without adding "px" or "%"). Necessary setting;</li>
<li><strong>"sliderShift"</strong> - adding shift to content for scroller. Flags: "true", "false". Necessary setting;</li>
<li><strong>"stepMultipler"</strong> - speed of scrolling. Flag: number. Necessary setting;</li>
<li><strong>"scrollBySelection"</strong> - ability to scroll by text selection. Flags: "true", "false". Necessary setting;</li>
<li><strong>"useWheelScroll"</strong> - ability to scroll by mouse wheel. Flags: "true", "false". Necessary setting;</li>
<li><strong>"useKeyboardScroll"</strong> - ability to scroll by keyboard buttons as "Arrows", "PageUp", "PageDown", "Home" and "End". Flags: "true", "false". Necessary setting;</li>
<li><strong>"dynamicContent"</strong> - this option configurate slider size and some calculation, if content has variable filling (like in case of infinity scrolling). Flags: "true", "false". Necessary setting;</li>
<li><strong>"contentResize"</strong> - if content width larger, then container, this option shrink this type of content, and delete horizontal scrollbar (if it allowed). Flags: "true", "false". Necessary setting;</li>
<li><strong>"autoHide"</strong> - existence of visual effect of hideable scroller. Flags: "true", "false". Necessary setting;</li>
<li><strong>"scrollerOpacityActive"</strong> - value opacity for active scroller. Flag: number. Not necessary setting, if you don't use auto hide effect;</li>
<li><strong>"scrollerOpacityPassive"</strong> - value opacity for passive scroller. Flag: number. Not necessary setting, if you don't use auto hide effect;</li>
<li><strong>"scrollerOpacityHidden"</strong> - value opacity for hidden scroller. Flag: number. Not necessary setting, if you don't use auto hide effect;</li>
<li><strong>"smoothlyScroll"</strong> - adding effect of smoothness at scrolling. Flags: "true", "false". Necessary setting;</li>
<li><strong>"smoothlyScrollOptions"</strong> - configurate css-transition property. Flag: string. Not necessary setting, if you don't use effect of smoothness;</li>
</ul>
<strong>Example:</strong>
</ol></li>
```javascript   
   container.scrollable({
      scrollerClass: "scroller-field",
      horizontalScrolling: "auto",
      scrollerXClass: "scroller-x-field",
      arrows: true,
      arrowsClass: "scroller-arrows",
      arrowChevron: {
        top: "<div class=\"arrow-chevron-top\"></div>",
        bottom: "<div class=\"arrow-chevron-bottom\"></div>",
        left: "<div class=\"arrow-chevron-left\"></div>",
        right: "<div class=\"arrow-chevron-right\"></div>"
      },
      sliderClass: "scroller-slider",
      sliderHeight: "auto",
      sliderHeightMin: 30,
      sliderShift: true,
      stepMultipler: 10,
      scrollBySelection: true,
      useWheelScroll: true,
      useKeyboardScroll: true,
      dynamicContent: true,
      contentResize: false,
      autoHide: true,
      scrollerOpacityActive: 1,
      scrollerOpacityPassive: 0.6,
      scrollerOpacityHidden: 0.4,
      smoothlyScroll: true,
      smoothlyScrollOptions: "0.3s all"
   });
```
