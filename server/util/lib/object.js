/**
 * Created by jimliu on 2020/1/15.
 * 对象类帮助函数
 */


/**
 * 简单的对象继承
 * @param old
 * @param n
 * @returns {*}
 */
exports.extend = function extend(old, n) {
    for (var key in n) {
        old[key] = n[key];
    }
    return old;
};

/**
 * 拷贝对象
 * 不支持函数
 * @param obj
 * @returns {*}
 */
exports.clone = function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * 转化对象
 * 把格式转化
 * @data 每个页面默认传来的配置
 * @newData 新数据， 把数组数据做下处理，以逗号, 隔开
 * @return  更新后的数据， 把数组数据做下处理，以逗号, 隔开
 * **/

exports.paramChange = function(data) {
    let newData = {};
    for (let key in data) {
        let item = data[key];

        if (item !== undefined) {
            if (Object.prototype.toString.call(item) === '[object Array]') {
                item = item.join(',');
            } else if (Object.prototype.toString.call(item) === '[object Object]') {
                item = JSON.stringify(item);
            }
            newData[key] = item;
        }
    }
    return newData;
}