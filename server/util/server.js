const date = require('./lib/date.js');
const cookie = require('./lib/cookie.js');
const log = require('./lib/log.js');
const operate = require('./lib/operate.js');
const object = require('./lib/object.js');
const encrypt = require('./lib/encrypt.js');
const param = require('./lib/paramverify.js');
const number = require('./lib/number.js');
let tips = require('./lib/tips.js');
const db = require('./lib/db.js');

module.exports = {
    log: log,
    date: date,
    object: object,
    number: number,
    cookie: cookie,
    encrypt: encrypt,
    operate: operate,
    param: param,
	db: db,
    errorModal(err){
        return object.clone(tips[err]);
    }
};