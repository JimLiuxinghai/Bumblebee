/**
 * Created by Jimliu on 2020/1/9.
 * 提示信息
 */

exports.OK = {
    "status": {
        "code": 200,
        "msg": "OK"
    },
    "data": {}
};
// 100 系统级别错误
exports.ERR_SYSTEM_ERROR = {
    "status": {
        "code": 100,
        "msg": "系统错误"
    }
};
// 2000 参数错误
exports.ERR_ERROR_NAME = {
    "status": {
        "code": 2001,
        "msg": "用户名或密码错误"
    }
};

// 2501 登录失效
exports.ERR_LOGIN = {
    "status": {
        "code": 2501,
        "msg": "请重新登录"
    }
}




