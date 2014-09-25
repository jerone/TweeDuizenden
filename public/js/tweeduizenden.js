$(function () {

  var sum = function () {
    var that = $(this),
        index = that.data("player-index"),
        row = that.parents("tr"),
        prev = parseInt(row.prev().find(".g2000n-player-" + index).val(), 10),
        preprev = parseInt(row.prev().prev().find(".g2000n-player-" + index).val(), 10);
    if (!isNaN(prev) && !isNaN(preprev)) {
      that.val(prev + preprev);
    } else {
      that.val("");
    }
  };
  
  $(".g2000n-value").keyup(function () {
    $(".g2000n-sum.g2000n-player-" + $(this).data("player-index")).each(sum);
  }).trigger("keyup");

});
