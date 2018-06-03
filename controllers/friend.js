var User = require('../models/user');
var Friend = require('../models/friend');
var checkSession = require('../beans/CheckSession');
// var mongoose = require('mongoose');

module.exports = {
    apply: function (req, res) {
        var _friend = req.session.friend;
        User.findOne({ nickname: _friend.nickname },function(err,user){
            if (err) {
                console.log(err);
            }
            if (!user) {
                res.send("<script>alert('哎呀~，没有找到该用户！');history.back();</script>");
                return;
            }
            req.session.friend = user;
            //申请添加好友
            var _friend = req.session.friend;
            // console.log('_friend._id:',_friend._id);//16进制字符串
            res.redirect('/user/apply/'+_friend._id);
        });
    }
};