var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String
    },
    nickname: {
        unique: true,
        type: String
    },
    password: String,
    sex: {
        type: Number,
        default: 1
    },
    phone: {
        unique: true,
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

/**
 * save预处理
 * 如果isNew，则创建和修改时间都是当前时间
 * 不过不是，只做修改
 */
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
// UserSchema.pre('update', function (next) {
//     var user = this;
//     // if (this.isNew) {
//     //     this.meta.createAt = this.meta.updateAt = Date.now();
//     // } else {
//     //     this.meta.updateAt = Date.now();
//     // }

//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) return next(err);

//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);
//             user.password = hash;
//             next();
//         });
//     });
// });

/**
 * 比较密码
 */
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        })
    }
};

UserSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({ _id: id }).exec(cb);
    }
}

module.exports = UserSchema;