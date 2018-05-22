var User = require('../models/user');

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
    var _user = req.body.user;
    User.findOne({ nickname: _user.nickname }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signup')
        } else {
            user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    })
}
//signin
exports.signin = function (req, res) {
    var _user = req.body.user;
    var nickname = _user.nickname;
    var password = _user.password;

    User.findOne({ nickname: nickname }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.redirect('/signup')
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                req.session.user = user;
                return res.redirect('/');
            } else {
                return res.redirect('/signin');
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
        res.render('chat/list', {
            title: '用户列表',
            users: users
        })
    })
}

//midware for user
exports.signinRequired = function (req, res, next) {
    var user = req.session.user
    if (!user) {
        return res.redirect('/signin')
    }
    next()
}

//midware for user
exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if (user.role <= 10) {
        return res.redirect('/signin')
    }
    next()
}