$(function () {
  $(".placeholder").each(function () {
    var that = $(this);
    that.data("placeholder", that.val());
  }).focus(function () {
    var that = $(this);
    if (that.val() === that.data("placeholder")) {
      that.val('');
    }
  }).blur(function () {
    var that = $(this);
    if (that.val() === "") {
      that.val(that.data("placeholder"));
    }
  }).triggerHandler("blur");
});
