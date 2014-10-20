$(function () {

  /*
   * Counting;
   */
  var sum = function () {
    var that = $(this),
        index = that.data("player-index"),
        row = that.parents("tr"),
        prev = parseInt(row.prev().find(".g2000n-player-" + index).val(), 10),
        preprev = parseInt(row.prev().prev().find(".g2000n-player-" + index).val(), 10);
    if (!isNaN(prev) && !isNaN(preprev)) {
      that.val(prev + preprev);
      that.parent().toggleClass("has-success", prev + preprev >= 2000);
    } else {
      that.val("");
    }
  };

  $(".g2000n-value").change(function () {
    $(".g2000n-sum.g2000n-player-" + $(this).data("player-index")).each(sum);
  }).trigger("change");


  /*
   * Fixed headers in table;
   *
   * Use this until `position:sticky` is supported in tables;
   * See http://caniuse.com/#feat=css-sticky
   */
  var floatThead = $("table.table").floatThead();
  $(".alert").on("closed.bs.alert", function () {
    floatThead.floatThead("reflow");
  });
  // Required for tablets when opening the keyboard;
  $('input').on('focus blur', function () {
    floatThead.floatThead("reflow");
  });


  /*
   * Confirm leaving page;
   */
  function onbeforeunload() {
    return "You are about to navigate away from this page.\n\nIf you leave this page all scrores that you have entered will be lost!\n\nUse the save button to save all scores.";
  }
  $(".g2000n-save").click(function () {
    window.onbeforeunload = null;
  });
  $(".g2000n-value").change(function () {
    window.onbeforeunload = onbeforeunload;
  });

});
