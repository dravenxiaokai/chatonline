var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/signin', { title: '用户登录' });
});

module.exports = router;
