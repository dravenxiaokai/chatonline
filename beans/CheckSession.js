module.exports = {
	check: function (req, res) {
		// 判断session中的user对象属性是否定义
		if (req.session.user == undefined) {
			// 如果session过期，重新登录后才能进行后续聊天信息
			res.send("<script>alert('登陆过期，请重新登陆！');location.href='/';</script>");
			return;
		}
		// 如果存在，返回session对象user属性
		return req.session.user;
	}
}
