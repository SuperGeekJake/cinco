/* GET home page. */
exports.index = function(req, res){
  res.render('menu', { title: 'Pente', game: false });
};

exports.game = function(req, res){
  res.render('game', { title: 'Pente', game: true });
};

exports.join = function(req, res){
  res.render('game', { title: 'Pente', game: true });
  console.log('Game ID: ' + req.params.id);
};