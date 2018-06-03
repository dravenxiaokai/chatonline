var checkSession = require('../beans/CheckSession');
var ws = require('ws');
var User = require('../models/user');

//显示好友列表页面
exports.showlist = function (req, res) {
    // var _user = req.body.user;
    var _user = req.session.user;
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('chat/list', {
            title: '好友列表',
            nickname: _user.nickname,
            users: users
        })
    })
}

//提供私聊的ws服务
const wsServer = new ws.Server({ port: 9090 });
wsServer.on('connection', function (websocket) {
    websocket.on('message', function (message) {
        var message = JSON.parse(message);
        console.log('message:', message.msg);
        wsServer.clients.forEach(function (client) {
            if (client !== websocket && client.readyState === ws.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });
});
//显示聊天界面
exports.showchat = function (req, res) {

    var to_nickname = req.params.nickname;
    var _user = checkSession.check(req, res);
    // var _user = req.session.user;
    console.log('to_nickname:', to_nickname);

    res.render('chat/showchat', {
        title: '聊天界面',
        to_nickname: to_nickname,
        user: _user
    });
}

//发送消息
exports.sendmsg = function (req, res) {
    var to_nickname = req.params.nickname;
    // var _user = checkSession.check(req, res);
    console.log('send to:', to_nickname);
    var content = req.body['content'];
    console.log('content:', content);
    // res.send(content);
    res.send({ "content": content });
}

//显示群聊页面
exports.showgroup = function (req, res) {
    var _user = checkSession.check(req, res);
    res.render('chat/showgroup', {
        title: '群聊房间',
        user: _user
    });
}
//提供群聊的ws服务
const wss = new ws.Server({ port: 9091 });
wss.on('connection', function (websocket) {
    websocket.on('message', function (message) {
        var message = JSON.parse(message);
        console.log('message:', message.msg);
        wss.clients.forEach(function (client) {
            if (client !== websocket && client.readyState === ws.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });
});
//发送群消息
exports.sendgroup = function(req,res){
    // var _user = checkSession.check(req, res);
    var content = req.body['content'];
    console.log('content:', content);
    // res.send(content);
    res.send({ "content": content });
}