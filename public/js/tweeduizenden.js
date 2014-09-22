$(function () {
  
  var sum = function () {
    var that = $(this);
    var clas = that.data("player-index");
    var row = that.parents("tr");
    var prev = parseInt(row.prev().find(".g2000-player-" + clas).val(), 10);
    var preprev = parseInt(row.prev().prev().find(".g2000-player-" + clas).val(), 10);
    //console.log(row, clas, prev, preprev);
    if (!isNaN(prev) && !isNaN(preprev)) {
      that.val(prev + preprev);
    } else {
      that.val("");
    }
  };
  
  $(".g2000-value").keyup(function () {
    $(".g2000-sum").each(sum);
  });


});
