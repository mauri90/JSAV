/**
* Module that contains interaction helpers for JSAV.
* Depends on core.js, anim.js
*/
(function($) {
  var jsanim = JSAV.anim;
  JSAV.ext.effects = {
    swap: function($str1, $str2, translateY) {
      var $val1 = $str1.find("span.jsavvalue"),
          $val2 = $str2.find("span.jsavvalue"),
          posdiffX = JSAV.position($val1).left - JSAV.position($val2).left,
          posdiffY = translateY?JSAV.position($val1).top - JSAV.position($val2).top:0,
          $both = $($str1).add($str2),
          str1prevStyle = $str1.getstyles("color", "background-color"),
          str2prevStyle = $str2.getstyles("color", "background-color"),
          speed = this.SPEED/5,
          tmp;

      // ..swap the value elements...
      var val1 = $val1[0],
          val2 = $val2[0],
          aparent = val1.parentNode,
          asibling = val1.nextSibling===val2 ? val1 : val1.nextSibling;
      val2.parentNode.insertBefore(val1, val2);
      aparent.insertBefore(val2, asibling);

      // ..swap the values in the attributes..
      tmp = $str1.attr("data-value");
      $str1.attr("data-value", $str2.attr("data-value"));
      $str2.attr("data-value", tmp);
      
      // ..and finally animate..
      if (!this.RECORD && !$.fx.off) {  // only animate when playing, not when recording
        if ('Raphael' in window) { // draw arrows only if Raphael is loaded
          var off1 = $val1.offset(),
              off2 = $val2.offset(),
              coff = this.canvas.offset(),
              x1 = off1.left - coff.left + $val1.outerWidth()/2,
              x2 = off2.left - coff.left + $val2.outerWidth()/2,
              y1 = off1.top - coff.top + $val1.outerHeight() + 5,
              y2 = y1,
              curve = 20,
              cx1 = x1,
              cx2 = x2,
              cy1 = y2 + curve,
              cy2 = y2 + curve,
              arrowStyle = "classic-wide-long";
          if (posdiffY > 1 || posdiffY < 1) {
            y2 = off2.top - coff.top + $val1.outerHeight() + 5;
            var angle = (y2 - y1) / (x2 - x1),
                c1 = Math.pow(y1, 2) - (curve*curve / (1 + angle*angle)),
                cy1 = y1 + Math.sqrt(y1*y1 - c1),
                cx1 = x1 - angle*Math.sqrt(y1*y1 - c1),
                c2 = Math.pow(y2, 2) - (curve*curve / (1 + angle*angle)),
                cy2 = y2 + Math.sqrt(y2*y2 - c2),
                cx2 = x2 - angle*Math.sqrt(y2*y2 - c2);
          }
          // .. and draw a curved path with arrowheads
          var arr = this.getSvg().path("M" + x1 + "," + y1 + "C" + cx1 + "," + cy1 + " " + cx2 + "," + cy2 + " " + x2 + "," + y2).attr({"arrow-start": arrowStyle, "arrow-end": arrowStyle, "stroke-width": 5, "stroke":"lightGray"});
        }
        // .. then set the position so that the array appears unchanged..
        $val1.css({"transform": "translate(" + (posdiffX) + "px, " + (posdiffY) + "px)"});
        $val2.css({"transform": "translate(" + (-posdiffX) + "px, " + (-posdiffY) + "px)"});
        // .. animate the color ..
        $both.animate({"color": "red", "background-color": "pink"}, 3*speed, function() {
          // ..animate the translation to 0, so they'll be in their final positions..
          $val1.animate({"transform": "translate(0, 0)"}, 7*speed, 'linear');
          $val2.animate({"transform": "translate(0, 0)"}, 7*speed, 'linear', 
            function() {
              if (arr) arr.remove(); // ..remove the arrows if they exist
              // ..and finally animate to the original styles.
              $str1.animate(str1prevStyle, speed);
              $str2.animate(str2prevStyle, speed);
          });
        });
      }
    }
  };
})(jQuery);