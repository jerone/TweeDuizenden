exports.index = function (req, res) {
  res.render('home', {
    title: req.i18n.t("home:title")
  });
};
