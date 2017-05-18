'use strict';

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
            } else {
              playerSumElement.parentNode.classList.remove('has-success');
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
    document.getElementById('g2000n-update').addEventListener('submit', function (e) {
      var form = this,
        $form = $(form);

      // Stop overriding form submit when `data-no-xhr` has been set.
      if (form.dataset['noXhr'] !== 'true') {
        form.dataset['noXhr'] = false;

        e.preventDefault();

        var action = this.action,
          params = $form.serialize();

        disableButtons($form.find('.g2000n-save'));

        window.setTimeout(function () {
          $.post(action, params, 'json').done(function (data) {
            if (data.error) {
              console.error('Save', data.error);
            } else {
              // Successful, update timestamp text and tooltip.
              var updatedElm = document.getElementById('g2000n-updated');
              updatedElm.dataset.timestamp = data.updated.timestamp;
              updatedElm.dataset.originalTitle = data.updated.datetime;
              updatedElm.textContent = data.updated.ago;

              // Successful, remove confirmation before leaving page.
              window.onbeforeunload = null;
            }
          }).fail(function (data) {
            console.error('Save', data);
          }).always(function () {
            restoreButtons($form.find('.g2000n-save'));
          });
        }, 500);  // Little visual style.

        return false;
      }
    });
    // Disable xhr form submit.
    Array.prototype.forEach.call(document.querySelectorAll('.g2000n-no-xhr'), function (elm) {
      elm.addEventListener('click', function () {
        findParentByTagName(this, 'form').dataset['noXhr'] = true;
      });
    });
    // Auto save.
    window.setInterval(function () {
      document.getElementById('g2000n-update').submit();
    }, 5 * 60 * 1000);



    /*
     * Auto time.
     */
    var lng = document.documentElement.getAttribute('lang');
    window.setInterval(function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-timestamp]'), function (elm) {
        var timestamp = parseInt(elm.dataset.timestamp, 10);
        elm.textContent = moment(timestamp).locale(lng).fromNow();
      });
    }, 60 * 1000);



    /*
     * Tooltips.
     */
    $('[data-toggle=tooltip]').tooltip();



    /*
     * Standings.
     */
    // Show button when JavaScript is supported.
    Array.prototype.forEach.call(document.querySelectorAll('.g2000n-standings'), function (elm) {
      elm.classList.remove('hidden');
    });
    // Update standings model with current standings.
    $('#standingsModal').on('show.bs.modal', function () {
      var standings = document.getElementById('standingsList');
      emptyElement(standings);

      var index = -1,
        totals = [],
        sum = function (elm) {
          if (elm.value && !isNaN(elm.value)) {
            total += parseInt(elm.value, 10);
          }
        };
      while (true) {
        index++;

        var inputs = document.querySelectorAll('.g2000n-value.g2000n-player-' + index);
        if (!inputs.length) break;

        var total = 0;
        Array.prototype.forEach.call(inputs, sum);

        var player = document.getElementById('g2000n-player-name-' + index).textContent;
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

        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', winner);
        listItem.appendChild(document.createTextNode(total.player));
        standings.appendChild(listItem);

        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.appendChild(document.createTextNode(total.score));
        listItem.appendChild(badge);
      });
    });



    /*
     * Confirm leaving page.
     */
    // Custom message only supported on older browser.
    function onbeforeunload() {
      return 'You are about to navigate away from this page.\n\nIf you leave this page all scores that you have entered will be lost!\n\nUse the save button to save all scores.';
    }
    // A value changed (without saving), ask users if they want to confirm before leaving.
    Array.prototype.forEach.call(document.querySelectorAll('.g2000n-value'), function (elm) {
      elm.addEventListener('change', function () {
        window.onbeforeunload = onbeforeunload;
      });
    });
    // Game is saved, don't need to confirm before leaving anymore.
    Array.prototype.forEach.call(document.querySelectorAll('.g2000n-save'), function (elm) {
      elm.addEventListener('click', function () {
        window.onbeforeunload = null;
      });
    });

  });
})();
