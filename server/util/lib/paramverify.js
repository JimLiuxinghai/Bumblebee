const _ = require('lodash');

let verifyType = exports.verifyType = function (value, type) {
    if (value) {
        switch (type) {
            case 'Number' :
                return  !isNaN(Number(value));
                break;
            case 'String' :
                return  true;
                break;
            case 'DateString' :
                return !isNaN(new Date(value).getDate());
                break;
            case 'DateStringArray' :
                let ary = value.split(',');
                return !isNaN(new Date(ary[0]).getDate()) && !isNaN(new Date(ary[1]).getDate());
                break;
        }
    }
    return true;
};
/**
 * 验证参数
 * @param data 参数对象
 * @param config 参数类型
 * */
exports.verify = function (data, config) {
    if (Array.isArray(config)) {
        let str = [];
        for (let i = 0, item; i < config.length; i++) {
            item = config[i];
            if (item.required) {
                if (!data[item.name]){
                    str.push(`${item.name}必填`);
                }
                else {
                    if (!verifyType(data[item.name], item.type)) {
                        str.push(`${item.name}格式不对，${item.type}`);
                    }
                }
            } else {
                if (!verifyType(data[item.name], item.type)) {
                    str.push(`${item.name}格式不对，${item.type}`);
                }
            }
        }

        return  str.length === 0 ||  str.join(',');
    } else {
        return true;
    }
};
/**
 * 验证指标名称
 * @param type string || array ||　''
 * @return {boolean} true || false
 * */
exports.verifyByType = function (type) {
    if (!type) {
        return true;
    }
    if (!_.isArray(type)) {
        type = type.split(',');
    }
    let root_quota = ENV_CONFIG.quota;
    let root = [];
    for(let k in root_quota) {
        let item = root_quota[k];
        if(Array.isArray(item)) {
            root = root.concat(item);
        }
    }
    //let root = ;
    let errorArr = _.filter(type, (v) =>{
        return root.indexOf(v) === -1;
    });
    return errorArr.length === 0;
};
