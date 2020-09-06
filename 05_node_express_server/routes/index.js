var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/', function(req, res, next) {
  res.json({name: 'jack', age: 19});
  res.end();
});

module.exports = router;
