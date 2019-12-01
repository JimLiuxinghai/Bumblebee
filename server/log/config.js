const path = require('path');

module.exports = function (logdir) {
    return {
        "appenders": {
            "ruleConsole": {"type": "console"},
            "ruleFile": {
                "type": "dateFile",
                "filename": path.join(logdir, 'access.log'),
                "pattern": ".yyyyMMdd",
                "alwaysIncludePattern": true
            }
        },
        "categories": {

            "default": {"appenders": ["ruleConsole", "ruleFile"], "level": "info"}

        },
        "replaceConsole": true
    };
};