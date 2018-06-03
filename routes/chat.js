var express = require('express');
var router = express.Router();

var Chat = require('../controllers/chat');

router.get('/list', Chat.showlist);
router.get('/show/:nickname',Chat.showchat);

// router.post('/send',Chat.sendmsg);
router.post('/send/:nickname',Chat.sendmsg);
//群聊
router.get('/group',Chat.showgroup);
router.post('/group',Chat.sendgroup);

module.exports = router;