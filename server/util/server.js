const date = require('./lib/date.js');
const cookie = require('./lib/cookie.js');
const log = require('./lib/log.js');
const operate = require('./lib/operate.js');
const object = require('./lib/object.js');
const encrypt = require('./lib/encrypt.js');
const number = require('./lib/number.js');
const request = require('./request');
const tips =require('./tips');
module.exports = {
    log,
    date,
    object,
    number,
    cookie,
    encrypt,
    operate,
    request,
    errorModal(err) {
        return object.clone(tips[err]);
    }
};