/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'version';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var config = require('../config/main.json');
var execute = function (message) {
    message.reply(t('version', {version: config.version, lngs: message.lang}));
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};