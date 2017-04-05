'use strict';

(function () {
  $(function () {

    /*
     * Show loader when clicked;
     */
    $('a.btn,.btn[type=submit]').click(function () {
      disableButtons($(this));
    });

  });

  /*
   * Disable buttons;
   */
  function disableButtons(btns) {
    return btns.not('.disabled').each(function () {
      var btn = $(this);
      btn.addClass('disabled');

      var icon = btn.find('.glyphicon');
      if (icon.length) {
        var glyphicon = btn.data('prev-glyphicon');
        if (!glyphicon) {
          glyphicon = Array.prototype.slice.call(icon.get(0).classList, 0).filter(function (clss) {
            return clss.indexOf('glyphicon-') > -1;
          })[0];
          btn.data('prev-glyphicon', glyphicon);
        }
        if (glyphicon !== 'glyphicon-refresh') {
          icon.removeClass(glyphicon);
          icon.addClass('glyphicon-refresh');
        }
        icon.addClass('glyphicon-refresh-animate');
      }

      var text = icon.length ? icon.next() : btn,
          loadingText = btn.data('loading-text');
      if (loadingText) {
        btn.data('restore-text', text.text());
        text.text(loadingText);
      }
    });
  }
  window.disableButtons = disableButtons;

  /*
   * Restore buttons;
   */
  function restoreButtons(btns) {
    return btns.filter('.disabled').each(function () {
      var btn = $(this),
          icon = btn.find('.glyphicon');
      if (icon.length) {
        var glyphicon = btn.data('prev-glyphicon');
        if (glyphicon && glyphicon !== 'glyphicon-refresh') {
          icon.addClass(glyphicon);
          icon.removeClass('glyphicon-refresh');
        }
        icon.removeClass('glyphicon-refresh-animate');
      }
      btn.removeClass('disabled');

      var text = icon.length ? icon.next() : btn,
          restoreText = btn.data('restore-text');
      if (restoreText) {
        text.text(restoreText);
      }
    });
  }
  window.restoreButtons = restoreButtons;


  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
	  var timeout;
	  return function () {
		  var context = this, args = arguments;
		  var later = function () {
			  timeout = null;
			  if (!immediate) func.apply(context, args);
		  };
		  var callNow = immediate && !timeout;
		  clearTimeout(timeout);
		  timeout = setTimeout(later, wait);
		  if (callNow) func.apply(context, args);
	  };
  };
  window.debounce = debounce;

})();
