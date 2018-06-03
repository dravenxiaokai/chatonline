var User = require('../models/user');
var checkSession = require('../beans/CheckSession');
var friend = require('../controllers/friend');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

//signin page
exports.showSignup = function (req, res) {
    res.render('user/signup', {
        title: '用户注册'
    })
}

//signin page
exports.showSignin = function (req, res) {
    res.render('user/signin', {
        title: '用户登录'
    })
}

//signup
exports.signup = function (req, res) {
    // var _user = req.body.user;
    //拿到请求参数中的nickname
    var nickname = req.body.nickname;
    //将表单中提交的所有参数封装到对象中
    var _user = {
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password,
        age: req.body.age,
        phone: req.body.phone
    };
    // console.log("_user:",_user.nickname);
    //查找当前昵称是否在数据库中已经存在
    User.findOne({ nickname: nickname }, function (err, user) {
        //如果出错，则打印出错误信息
        if (err) {
            console.log(err);
        }
        //如果用户已存在，则重定向到注册页面
        if (user) {
            res.send("<script>alert('该昵称已被占用！');history.back();</script>");
            return;
            // return res.redirect('/signup');
        } else {
            //否则没有该用户，new一个User对象实例
            user = new User(_user);
            //通过user实例对数据库进行插入操作
            user.save(function (err, user) {
                if (err) {
                    if (err.message.indexOf('email_1 dup key') > -1) {
                        res.send("<script>alert('该邮箱已被注册！');history.back();</script>");
                        return;
                    }
                    if (err.message.indexOf('phone_1 dup key') > -1) {
                        res.send("<script>alert('该手机号已被注册！');history.back();</script>");
                        return;
                    }
                    console.log(err);
                }
                res.redirect(307, './signin');
            })
        }
    })
}
//signin
// var _user = req.body.user;
// var email = _user.email;
exports.signin = function (req, res) {
    //拿到表单中填写的nickname
    var nickname = req.body.nickname;
    //拿到表单中填写的密码
    var password = req.body.password;

    // console.log("nickname:",nickname);
    //根据昵称查找用户
    User.findOne({ nickname: nickname }, function (err, user) {
        if (err) {
            console.log(err);
        }
        //如果不存在，跳转到注册页面
        if (!user) {
            return res.redirect('/user/signup')
        }
        //比较密码
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            //如果匹配
            if (isMatch) {
                //将user数据保存到session中
                req.session.user = user;
                //返回重定向到聊天列表页
                return res.redirect('/chat/list');
            } else {
                //如果不匹配，回到首页
                return res.redirect('/');
            }
        })
    })
}

//logout
exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user
    res.redirect('/');
}

//userlist page
exports.userlist = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('user/userlist', {
            title: '用户列表',
            users: users
        })
    })
}

//addfriend page
exports.showAddfriend = function (req, res) {
    res.render('user/addfriend', {
        title: '添加好友'
    });
}

//addfriend
exports.addfriend = function (req, res) {
    req.session.user = checkSession.check(req, res);
    if (!req.session.user) { return; }
    var _friend = {
        nickname: req.body.nickname
    };
    req.session.friend = _friend;
    friend.apply(req, res);
}

//申请好友
exports.apply = function (req, res) {
    var _id = req.params.id;
    console.log('_id:', _id);
    var obj_id = mongoose.Types.ObjectId(_id);
    console.log('obj_id:', obj_id);
    res.send("<script>location.href='/chat/list';</script>");
}

//展示修改昵称页面
exports.showEditName = function (req, res) {
    var _user = checkSession.check(req, res);
    res.render('user/editName', {
        title: '修改昵称',
        nickname: _user.nickname
    });
}
//修改昵称
exports.updateName = function (req, res) {
    var nickname = checkSession.check(req, res).nickname;
    var newName = req.body.newName;
    console.log('newName:', newName);
    User.update({ nickname: nickname }, { $set: { nickname: newName, meta: { createAt: Date.now(), updateAt: Date.now() } } }, function (err) {
        if (err) {
            console.log('更新出错：', err);
        } else {
            console.log('密码更新成功！');
            return res.send("<script>alert('昵称更新成功！请重新登录！');location.href='/';</script>");
            // res.redirect('/chat/list');
        }
    });
}
//展示修改密码
exports.showeditPwd = function (req, res) {
    var _user = checkSession.check(req, res);
    res.render('user/editPwd', {
        title: '修改密码',
        nickname: _user.nickname
    });
}
//更新密码
exports.updatePwd = function (req, res) {
    var nickname = checkSession.check(req, res).nickname;
    var originpwd = req.body.originpwd;
    var newpwd = req.body.newpwd;
    //根据昵称查找用户
    User.findOne({ nickname: nickname }, function (err, user) {
        if (err) {
            console.log(err);
        }
        //如果不存在，跳转到注册页面
        if (!user) {
            return res.redirect('/user/signin');
        }
        //比较密码
        user.comparePassword(originpwd, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            //如果匹配
            if (isMatch) {
                //原密码正确
                //加密新密码
                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) return next(err);

                    bcrypt.hash(newpwd, salt, function (err, hash) {
                        if (err) return next(err);
                        newpwd = hash;
                        console.log('newpwd:', newpwd);
                        //更新密码
                        User.update({ nickname: nickname }, { $set: { password: newpwd, meta: { createAt: Date.now(), updateAt: Date.now() } } }, function (err) {
                            if (err) {
                                console.log('更新出错：', err);
                            } else {
                                console.log('密码更新成功！');
                                return res.send("<script>alert('密码更新成功！请重新登录！');location.href='/';</script>");
                            }
                        });
                    });
                });
            } else {
                //如果不匹配，原密码错误
                res.send("<script>alert('原密码错误！');history.back();</script>");
                return;
            }
        })
    })
}

//midware for user
exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if (!user) {
        return res.redirect('/signin');
    }
    next();
}

//midware for user
exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if (user.role <= 10) {
        return res.redirect('/signin');
    }
    next();
}