const fs = require('fs');

function loader(url) {
    //同步方法无所谓的，因为是在服务器跑起来之前就完成映射，不会有任何性能影响
    const dir = fs.readdirSync(url);

    return dir.map((filename) => {
        const module = require(url + '/' + filename);
        return { name: filename.split('.')[0], module };
    });
}


function loadController() {
    const url = __dirname + '/controller';
    return loader(url);
}

function loadService() {
    const url = __dirname + '/service';
    return loader(url);
}

module.exports = {
    loadController,
    loadService
};