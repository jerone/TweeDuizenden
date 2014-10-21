$(function () {

  /*
   * Show loader when clicked;
   */
  $('.btn:not(label)').click(function (e) {
    var btn = $(this);
    btn.addClass('disabled');

    var icon = btn.find('.glyphicon'),
        glyphicon = btn.data('prev-glyphicon');
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

    var text = icon.next(),
        loadingText = btn.data('loading-text');
    if (loadingText) {
      btn.data('restore-text', text.text());
      text.text(loadingText);
    }
  });
});

/*
   * Restore button;
   */
function restoreButton(btns) {
  return btns.each(function () {
    var btn = $(this),
        icon = btn.find('.glyphicon'),
        glyphicon = btn.data('prev-glyphicon');
    if (glyphicon && glyphicon !== 'glyphicon-refresh') {
      icon.addClass(glyphicon);
      icon.removeClass('glyphicon-refresh');
    }
    icon.removeClass('glyphicon-refresh-animate');
    btn.removeClass('disabled');

    var text = icon.next(),
        restoreText = btn.data('restore-text');
    if (restoreText) {
      text.text(restoreText);
    }
  });
}
