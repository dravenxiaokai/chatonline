var express = require('express');
var router = express.Router();

var User = require('../controllers/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//user
router.get('/signup', User.showSignup);
router.get('/signin', User.showSignin);
router.post('/signup', User.signup);
router.post('/signin', User.signin);
router.get('/logout',User.logout);
router.get('/userlist',User.userlist);

router.get('/addfriend',User.showAddfriend);
router.post('/addfriend',User.addfriend);
//好友申请
router.get('/apply/:id',User.apply);
//修改昵称
router.get('/editName',User.showEditName);
router.post('/updateName',User.updateName);
//修改密码
router.get('/editPwd',User.showeditPwd);
router.post('/updatePwd',User.updatePwd);

/**
 * 登录方法
 * subflag为1，则为post请求
 */
// router.all('/signin', function (req, res, next) {
//   //隐藏域
//   var subflag = req.body['subflag'];
//   if (subflag == undefined) {
//     //浏览器渲染
//     //res.send('请登录');
//     res.render('users/signin', {});
//   } else {

//   }
// })

/**
 * 用户注册
 */
// router.all('/signup', function (req, res, next) {
//   var subflag = req.body['subflag'];
//   if(subflag == undefined){
//     res.render('users/signup', {});
//   }else{
//     //var email = req.body['email'];
//     var _user = req.body['nickname'];

//   }
// })

module.exports = router;
