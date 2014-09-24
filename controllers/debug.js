exports.all = function (req, res) {
  res.send({
    body: req.body,
    params: req.params,
    query: req.query
  });
};
exports.body = function (req, res) {
  res.send(req.body);
};
exports.params = function (req, res) {
  res.send(req.params);
};
exports.query = function (req, res) {
  res.send(req.query);
};
