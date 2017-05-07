'use strict';

(function () {
  /* global restoreButtons */
  $(function () {

    /*
     * Delete all.
     */
    $('#g2000n-delete-all').submit(function (e) {
      e.preventDefault();

      var form = $(this);
      if (confirm(form.data('confirm'))) {
        var action = form.attr('action'),
          params = form.serialize(),
          tbody = $('#g2000n-table tbody'),
          rows = tbody.find('tr');

        $.post(action, params, 'json').done(function (data) {
          if (data.error) {
            console.error(data.error);
          } else {
            rows.fadeOut().promise().done(function () {
              rows.remove();
              tbody.append($('#empty-template').html());
              $('#g2000n-delete-all button').attr('disabled', true).addClass('disabled');
            });
          }
        }).fail(function (data) {
          console.error(data);
        }).always(function () {
          restoreButtons(form.find('.btn'));
        });
      } else {
        restoreButtons(form.find('.btn'));
      }

      return false;
    });

    /*
     * Delete per game.
     */
    $('.g2000n-delete').submit(function (e) {
      e.preventDefault();

      var form = $(this);
      if (confirm(form.data('confirm'))) {
        var action = form.attr('action'),
          params = form.serialize(),
          tbody = form.parents('tbody'),
          row = form.parents('tr');

        $.post(action, params, 'json').done(function (data) {
          if (data.error) {
            console.error(data.error);
          } else {
            row.fadeOut(function () {
              row.remove();
              if (tbody.children('tr').length === 0) {
                tbody.append($('#empty-template').html());
                $('#g2000n-delete-all button').attr('disabled', true).addClass('disabled');
              }
            });
          }
        }).fail(function (data) {
          console.error(data);
        }).always(function () {
          restoreButtons(form.find('.btn'));
        });
      } else {
        restoreButtons(form.find('.btn'));
      }

      return false;
    });

    /*
     * Open admin section with Konami Code.
     */
    cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
      if (location.href.indexOf('admin=true') === -1 && confirm('You found the easter egg with the Konami Code :)\nYou will now be directed to the admin section.')) {
        location.href += '?admin=true';
      }
    });
  });
})();
