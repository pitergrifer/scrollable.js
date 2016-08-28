# scrollable.js by Bogdan Danileichenko (@piter_grifer)

## About
scrollable.js - its prototype for JavaScript object.
New methood obj.scrollable() can generate custom scrollbar on HTML element.
With scrollable.js you can use you own scrolle, which you can stylezed and
customize the behavior to fit your needs and preferences.

## Usage
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

Option | Description | Default | Necessity
:---: | :--- | :---: | :---:
verticalScroller | Vertical scroller exisence. Flags: "true" (bool), "false" (bool) or "auto" (string). In "auto" flag vertical scroller created only, if content height larger, then height of container. | true | No
scrollerYClass | CSS-class of vertical scroller. |  | Yes, if you use vertical scroller
horizontalScroller | Horizontal scroller exisence. Flags: "true" (bool), "false" (bool) or "auto" (string). In "auto" flag horizontal scroller created only, if content width larger, then width of container. | true | No
scrollerXClass | CSS-class of horizontal scroller. |  | Yes, if you use horizontal scroller
scrollerShift | Push content to the side of the scroller. Flags: "true" (bool), "false" (bool). | true | No
arrows | Arrows presence. Flags: "true" (bool), "false" (bool). | true | No
arrowsClass | CSS-class of arrows. |  | Yes, if you use arrows
arrowChevron | Object with HTML code for arrows chevrons. Keys: "top", "bottom", "left", "right" for top, bottom, left and right arrows respectively. |  | Yes, if you use arrows
sliderClass | CSS-class of sliders. |  | Yes
sliderSize | Define sliders sizes. Flags: "auto" (string) - calculated based on content size; number (int) (without adding "px" or "%") - height in pixels. | "auto" | No
sliderSizeMin | Minimal size of sliders. Flag: number (int) (without adding "px" or "%"). | 15 | No
stepMultipler | Speed of scrolling. Flag: number (int) | 15 | No
scrollBySelection | Ability to scroll by text selection. Flags: "true" (bool), "false" (bool). | true | No 
useWheelScroll | Ability to scroll by mouse wheel. Flags: "true" (bool), "false" (bool). | true | No
useKeyboardScroll | Ability to scroll by keyboard buttons as "Arrows", "PageUp", "PageDown", "Home" and "End". Flags: "true" (bool), "false" (bool). | true | No
dynamicContent | This option configurate slider size and do some calculations, if content has variable filling (like in case of infinity scrolling). Flags: "true" (bool), "false" (bool). | false | No
autoHide | Existence of visual effect of hideable scroller. Flags: "true" (bool), "false" (bool). | true | No
scrollerOpacityActive | Value opacity for active scroller condition. Flag: number. | 1 | No
scrollerOpacityPassive | Value opacity for passive scroller condition. Flag: number. | 0.5 | No
scrollerOpacityHidden | Value opacity for Hidden scroller condition. Flag: number. | 0.2 | No
smoothlyScroll | Adding effect of smoothness at scrolling. Flags: "true" (bool), "false" (bool). | false | No
smoothlyScrollOptions | Configurate css-transition property. Flag: string. | "0.3s top, 0.3s left" | No

</ol></li>

<strong>Example 1 (full setting):</strong>
```javascript   
   container.scrollable({
     verticalScroller: "auto",
     scrollerYClass: "scroller-y-field",
     horizontalScroller: "auto",
     scrollerXClass: "scroller-x-field",
     scrollerShift: true,
     arrows: true,
     arrowsClass: "scroller-arrows",
     arrowChevron: {
       top: "<div class=\"arrow-chevron-top\"></div>",
       bottom: "<div class=\"arrow-chevron-bottom\"></div>",
       left: "<div class=\"arrow-chevron-left\"></div>",
       right: "<div class=\"arrow-chevron-right\"></div>"
     },
     sliderClass: "scroller-slider",
     sliderSize: "auto",
     sliderSizeMin: 30,
     stepMultipler: 15,
     scrollBySelection: true,
     useWheelScroll: true,
     useKeyboardScroll: true,
     dynamicContent: true,
     autoHide: true,
     scrollerOpacityActive: 1,
     scrollerOpacityPassive: 0.5,
     scrollerOpacityHidden: 0.2,
     smoothlyScroll: true,
     smoothlyScrollOptions: "0.3s top, 0.3s left"
   });
```

<strong>Example 2 (quick setup):</strong>
```javascript   
   container.scrollable({
     scrollerYClass: "scroller-y-field",
     scrollerXClass: "scroller-x-field",
     arrowsClass: "scroller-arrows",
     arrowChevron: {
       top: "<div class=\"arrow-chevron-top\"></div>",
       bottom: "<div class=\"arrow-chevron-bottom\"></div>",
       left: "<div class=\"arrow-chevron-left\"></div>",
       right: "<div class=\"arrow-chevron-right\"></div>"
     },
     sliderClass: "scroller-slider"
   });
```
