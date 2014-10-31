﻿$(function () {

  /*
   * Counting;
   */
  var sum = function () {
    var that = $(this),
        index = that.data('player-index'),
        row = that.parents('tr'),
        prev = parseInt(row.prev().find('.g2000n-player-' + index).val(), 10),
        preprev = parseInt(row.prev().prev().find('.g2000n-player-' + index).val(), 10);
    if (!isNaN(prev) && !isNaN(preprev)) {
      that.val(prev + preprev);
      that.parent().toggleClass('has-success', prev + preprev >= 2000);
    } else {
      that.val('');
    }
  };

  $('.g2000n-value').change(function () {
    $('.g2000n-sum.g2000n-player-' + $(this).data('player-index')).each(sum);
  }).trigger('change');



  /*
   * Fixed headers in table;
   *
   * Use this until `position:sticky` is supported in tables;
   * See http://caniuse.com/#feat=css-sticky
   */
  var floatThead = $('table.table').floatThead();
  $('.alert').on('closed.bs.alert', function () {
    floatThead.floatThead('reflow');
  });
  // Required for tablets when opening the keyboard;
  $('input').on('focus blur', function () {
    floatThead.floatThead('reflow');
  });



  /*
   * Save;
   */
  $('#g2000n-update').submit(function (e) {
    var form = $(this),
        action = form.attr('action'),
        params = form.serialize();

    if (form.data('cancel') !== true) {
      form.data('cancel', false);

      disableButtons(form.find('.g2000n-save'));

      window.setTimeout(function () {
        $.post(action, params, 'json').done(function (data) {
          if (data.error) {
            console.error(data.error);
          } else {
            $('.g2000n-updated').data('timestamp', data.updated.timestamp).attr('title', data.updated.datetime).text(data.updated.ago);
            window.onbeforeunload = null;
          }
        }).fail(function (data) {
          console.error(data);
        }).always(function () {
          restoreButtons(form.find('.g2000n-save'));
        });
      }, 500);  // Little visual style;

      return false;
    }
  });
  $('.g2000n-clone').click(function () {
    $(this).parents('form').first().data('cancel', true);
  });
  // Auto save;
  window.setInterval(function () {
    $('#g2000n-update').submit();
  }, 5 * 60 * 1000);



  /*
   * Auto time;
   */
  var lng = $('html').attr('lang');
  window.setInterval(function () {
    $('[data-timestamp]').each(function () {
      var that = $(this);
      that.text(moment(that.data('timestamp')).locale(lng).fromNow());
    });
  }, 60 * 1000);



  /*
   * Tooltips;
   */
  $('[data-toggle=tooltip]').tooltip();



  /*
   * Standings;
   */
  $('.g2000n-standings').removeClass('hidden');
  $('#standingsModal').on('show.bs.modal', function (e) {
    var standings = $('#standingsList').empty(),
        index = -1,
        totals = [];
    while (true) {
      index++;

      var inputs = $('.g2000n-value.g2000n-player-' + index);
      if (!inputs.length) { break; }

      var total = 0;
      inputs.each(function () {
        if (this.value && !isNaN(this.value)) {
          total += parseInt(this.value, 10);
        }
      });

      var player = $('#g2000n-player-name-' + index).text();
      totals.push({ player: player, score: total });
    }

    totals.sort(function (a, b) { return b.score - a.score; });

    $.each(totals, function (index, total) {
      var winner = 'list-group-item-danger';
      if (total.score >= 2000) {
        if (index === 0 || total.score === totals[0].score) {
          winner = 'list-group-item-success';
        } else {
          winner = 'list-group-item-warning';
        }
      }

      standings.append(
        $('<li/>').addClass('list-group-item ' + winner).text(total.player).prepend(
          $('<span/>').addClass('badge').text(total.score)));
    });
  });


  /*
   * Confirm leaving page;
   */
  function onbeforeunload() {
    return 'You are about to navigate away from this page.\n\nIf you leave this page all scrores that you have entered will be lost!\n\nUse the save button to save all scores.';
  }
  $('.g2000n-save').click(function () {
    window.onbeforeunload = null;
  });
  $('.g2000n-value').change(function () {
    window.onbeforeunload = onbeforeunload;
  });

});
