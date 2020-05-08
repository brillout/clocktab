import assert from "@brillout/assert";
import { track_error } from "../../tab-utils/views/common/tracker";

(function () {
  if (typeof window === "undefined") {
    return;
  }

  Element.prototype.hide = function () //{{{
  {
    this.style.visibility = "hidden";
  };
  //}}}
  Element.prototype.show = function () //{{{
  {
    this.style.visibility = "inherit";
  };
  //}}}

  Element.prototype.getStyle = function (
    styleProp //{{{
  ) {
    return document.defaultView
      .getComputedStyle(this, null)
      .getPropertyValue(styleProp);
  };
  //}}}

  Element.prototype.getPosition = function () //{{{
  {
    var curleft = 0;
    var curtop = 0;
    var e = this;
    do {
      curleft += e.offsetLeft;
      curtop += e.offsetTop;
    } while ((e = e.offsetParent));
    return { x: curleft, y: curtop };
  };
  //}}}

  Element.prototype.setTextSize = function (
    width,
    height,
    noDOMChanges,
    possibleChars
  ) {
    //assert width & height in px
    //assert this.style.display=='inline-block'

    //absolute font-size is equally precise as percentage font-size
    //chars can have different widths
    //assumption that width of a text is proportional to its fontSize is wrong but good approx
    assert.warning(this.tagName !== "TEXTAREA");
    /*
  if(width===0||height===0)
  {
    if(noDOMChanges) return {width:0,height:0};
    this.style.fontSize = "0px";
    return;
  }
  */
    assert.warning(width && height);
    var DUMMY_SIZE = 100; //intuitively: the bigger the font-size the more precise the approximation

    var dummy = document.createElement(this.tagName);
    dummy.style.fontSize = DUMMY_SIZE + "px"; //is better approx than percentage since same preciseness
    dummy.style.display = "inline-block";
    dummy.style.whiteSpace = "nowrap"; //should this be equal to this.getStyle('white-space')?
    dummy.style.position = "absolute";
    dummy.style.fontFamily = this.getStyle("font-family");
    dummy.style.letterSpacing = this.getStyle("letter-spacing");
    //hide this shit
    dummy.style.top = "-9999px";
    dummy.style.zIndex = "-1";
    dummy.style.visibility = "hidden";

    var worstCaseText = this.innerHTML;
    if (worstCaseText === "") worstCaseText = "y";
    else if (possibleChars) {
      //if possibleChars not given we then assume that all char have same width
      assert.warning(this.innerHTML === this.textContent);
      assert.warning(
        possibleChars.constructor === Array && possibleChars.length > 0
      );
      //determining worst case char
      var widestChar;
      var widestSize = -1;
      document.documentElement.appendChild(dummy);
      for (var i = 0; i < possibleChars.length; i++) {
        var char_ = possibleChars[i];
        dummy.innerHTML = char_;
        var charWidth = parseInt(dummy.getStyle("width"), 10);
        if (charWidth > widestSize) {
          widestSize = charWidth;
          widestChar = char_;
        }
      }
      assert.warning(widestChar);
      worstCaseText = "";
      for (var i = 0; i < this.textContent.length; i++)
        worstCaseText += widestChar;
    }

    dummy.innerHTML = worstCaseText;
    document.documentElement.appendChild(dummy);
    var width_dummy = parseInt(dummy.getStyle("width"), 10);
    var height_dummy = parseInt(dummy.getStyle("height"), 10);
    var ratio = Math.min(height / height_dummy, width / width_dummy);
    document.documentElement.removeChild(dummy);

    if (noDOMChanges)
      return {
        width: ratio * width_dummy,
        height: ratio * height_dummy,
        fontSize: ratio * DUMMY_SIZE,
      };
    this.style.fontSize = Math.floor(ratio * DUMMY_SIZE) + "px";

    //******** Refinment ********
    assert.warning(
      this.getStyle("display") === "block" ||
        this.getStyle("display") === "inline-block" ||
        this.getStyle("display") === "table-cell",
      "this.getStyle('display')==" + this.getStyle("display"),
      1
    );
    this.hide();
    //==old approx
    //x-height ~=/2 font-size in px ~= height of text -> x-width ~=/2 font-size in px
    //this.style.fontSize=1.3*( Math.min(parseInt(height,10),parseInt(width,10)/countCharacters(this)) )+'px';
    //var max=1000;

    {
      const { fontSize } = this.style;
      const fontSize__computed = this.getStyle("font-size");
      if (fontSize__computed !== fontSize) {
        track_error({
          name: "[known][msg-tab] computed font-size !== set font-size",
          value: JSON.stringify({ fontSize__computed, fontSize }),
        });
      }
    }

    //assert.warning(parseInt(this.getStyle('width' ),10)===this.clientWidth);
    //assert.warning(parseInt(this.getStyle('height'),10)===this.clientHeight,"this.getStyle('height')==="+this.getStyle('height')+" && this.clientHeight==="+this.clientHeight+" && this.scrollHeight==="+this.scrollHeight);

    var max = 100;

    while (
      this.getStyle("width") < width &&
      this.getStyle("height") < height &&
      --max
    )
      this.style.fontSize = parseInt(this.style.fontSize, 10) + 2 + "px";
    while (
      (this.getStyle("width") > width || this.getStyle("height") > height) &&
      --max
    )
      this.style.fontSize = parseInt(this.style.fontSize, 10) - 1 + "px";
    assert.warning(max > 0, "max===0");
    this.show();
  };
})();
