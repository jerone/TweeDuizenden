﻿'use strict';

(function () {
  /* global disableButtons,restoreButtons,moment,gameType */
  $(function () {

    /*
     * Counting.
     */
    function counting() {
      var playerElementClass = '.g2000n-player-' + this.dataset.playerIndex;
      var playerSumElements = document.querySelectorAll(playerElementClass + '.g2000n-sum');
      Array.prototype.forEach.call(playerSumElements, function (playerSumElement) {
        var playerSumRow = findParentByTagName(playerSumElement, 'tr'),
          prevPlayerInputElement = playerSumRow.previousElementSibling.querySelector(playerElementClass).value,
          prevPrevPlayerInputElement = playerSumRow.previousElementSibling.previousElementSibling.querySelector(playerElementClass).value,
          total;

        if (prevPlayerInputElement && !isNaN(prevPlayerInputElement) && prevPrevPlayerInputElement && !isNaN(prevPrevPlayerInputElement)) {
          if (gameType.direction === '+') {
            total = parseInt(prevPrevPlayerInputElement, 10) + parseInt(prevPlayerInputElement, 10);
          } else if (gameType.direction === '-') {
            total = parseInt(prevPrevPlayerInputElement, 10) - parseInt(prevPlayerInputElement, 10);
          }
          playerSumElement.value = total;

          if (gameType.win.end !== null) {
            if (gameType.win.direction === 'highest' && total >= gameType.win.end) {
              playerSumElement.parentNode.classList.add('has-success');
            } else if (gameType.win.direction === 'lowest' && total <= gameType.win.end) {
              playerSumElement.parentNode.classList.add('has-success');
            }
          } else {
            playerSumElement.parentNode.classList.remove('has-success');
          }
        } else {
          playerSumElement.value = '';
        }
      });
    };

    var alreadyExecutedColumnCounting = [];
    var playerValueElements = document.querySelectorAll('.g2000n-value');
    Array.prototype.forEach.call(playerValueElements, function (playerValueElement) {
      var countingDebounced = debounce(counting, 500);
      playerValueElement.addEventListener('change', countingDebounced);
      playerValueElement.addEventListener('blur', countingDebounced);
      playerValueElement.addEventListener('keyup', countingDebounced);

      // Only trigger counting on the first input as the counting function takes care of all inputs in that column.
      var playerIndex = playerValueElement.dataset.playerIndex;
      if (alreadyExecutedColumnCounting.indexOf(playerIndex) === -1) {
        alreadyExecutedColumnCounting.push(playerIndex);
        counting.call(playerValueElement);
      }
    });



    /*
     * Fixed headers in table.
     *
     * Use this until `position:sticky` is supported in tables.
     * See http://caniuse.com/#feat=css-sticky
     */
    var floatThead = $('table.table').floatThead({
      position: 'absolute',
      support: {
        bootstrap: true,
        datatables: false,
        jqueryUI: false,
        perfectScrollbar: false
      }
    });
    $('.alert').on('closed.bs.alert', function () {
      floatThead.floatThead('reflow');
    });
    //// Required for tablets when opening the keyboard.
    //$('input').on('focus blur', function () {
    //  floatThead.floatThead('reflow');
    //});

    /*
     * Save.
     */
    $('#g2000n-update').submit(function () {
      var form = $(this);

      // Stop overriding form submit when `data-no-xhr` has been set.
      if (form.data('no-xhr') !== true) {
        form.data('no-xhr', false);

        var action = form.attr('action'),
            params = form.serialize();

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
        }, 500);  // Little visual style.

        return false;
      }
    });
    // Disable xhr form submit.
    $('.g2000n-no-xhr').click(function () {
      $(this).parents('form').first().data('no-xhr', true);
    });
    // Auto save.
    window.setInterval(function () {
      $('#g2000n-update').submit();
    }, 5 * 60 * 1000);

    /*
     * Auto time.
     */
    var lng = $('html').attr('lang');
    window.setInterval(function () {
      $('[data-timestamp]').each(function () {
        var that = $(this);
        that.text(moment(that.data('timestamp')).locale(lng).fromNow());
      });
    }, 60 * 1000);

    /*
     * Tooltips.
     */
    $('[data-toggle=tooltip]').tooltip();

    /*
     * Standings.
     */
    $('.g2000n-standings').removeClass('hidden');
    $('#standingsModal').on('show.bs.modal', function () {
      var standings = $('#standingsList').empty(),
          index = -1,
          totals = [],
          sum = function () {
            if (this.value && !isNaN(this.value)) {
              total += parseInt(this.value, 10);
            }
          };
      while (true) {
        index++;

        var inputs = $('.g2000n-value.g2000n-player-' + index);
        if (!inputs.length) { break; }

        var total = 0;
        inputs.each(sum);

        var player = $('#g2000n-player-name-' + index).text();
        totals.push({ player: player, score: total });
      }

      if (gameType.win.direction === 'highest') {
        totals.sort(function (a, b) { return b.score - a.score; });
      } else if (gameType.win.direction === 'lowest') {
        totals.sort(function (a, b) { return a.score - b.score; });
      }

      totals.forEach(function (total, index) {
        var winner = 'list-group-item-danger';
        if (index === 0 || total.score === totals[0].score) {
          winner = 'list-group-item-success';
        } else if (gameType.win.end !== null) {
          if (gameType.win.direction === 'highest' && total.score >= gameType.win.end) {
            winner = 'list-group-item-warning';
          } else if (gameType.win.direction === 'lowest' && total.score <= gameType.win.end) {
            winner = 'list-group-item-warning';
          }
        }

        standings.append(
        $('<li/>').addClass('list-group-item ' + winner).text(total.player).prepend(
          $('<span/>').addClass('badge').text(total.score)));
      });
    });

    /*
     * Confirm leaving page.
     */
    function onbeforeunload() {
      return 'You are about to navigate away from this page.\n\nIf you leave this page all scores that you have entered will be lost!\n\nUse the save button to save all scores.';
    }
    $('.g2000n-save').click(function () {
      window.onbeforeunload = null;
    });
    $('.g2000n-value').change(function () {
      window.onbeforeunload = onbeforeunload;
    });

  });

  // Find parent element by tag-name.
  function findParentByTagName(element, tag) {
    tag = tag.toLowerCase();
    while (element.parentNode) {
      element = element.parentNode;
      if (element.tagName.toLowerCase() === tag)
        return element;
    }
    return null;
  }
})();
