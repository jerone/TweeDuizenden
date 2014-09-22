$(function () {

  var sum = function () {
    var that = $(this);
    var index = that.data("player-index");
    var row = that.parents("tr");
    var prev = parseInt(row.prev().find(".g2000-player-" + index).val(), 10);
    var preprev = parseInt(row.prev().prev().find(".g2000-player-" + index).val(), 10);
    if (!isNaN(prev) && !isNaN(preprev)) {
      that.val(prev + preprev);
    } else {
      that.val("");
    }
  };
  
  $(".g2000-value").keyup(function () {
    var that = $(this);
    var index = that.data("player-index");
    $(".g2000-sum.g2000-player-" + index).each(sum);
  });

});
