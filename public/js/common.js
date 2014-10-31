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
