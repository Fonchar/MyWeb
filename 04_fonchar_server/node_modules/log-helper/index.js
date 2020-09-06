const chalk = require('chalk');
const dateFormat = require('dateformat');
const { fromJS } = require('immutable');

function parseChalkStringToChalkObject(chalkString) {
    if (typeof chalkString === 'string') {
        const chalkOptions = chalkString.split('.');
        let chalkObject = chalk[chalkOptions[0]];
        for (let i = 1; i < chalkOptions.length; i += 1) {
            chalkObject = typeof chalkObject[chalkOptions[i]] === 'function' ? chalkObject[chalkOptions[i]] : chalk.white;
        }
        return chalkObject;
    }
    return chalkString;
}

function parseConfigObject(config) {
    Object.keys(config).forEach((key) => {
        if (config[key] && typeof config[key] === 'object') {
            parseConfigObject(config[key]);
        } else if (key === 'chalk' || key === 'dateChalk') {
            // eslint-disable-next-line no-param-reassign
            config[key] = parseChalkStringToChalkObject(config[key]);
        }
    });
    return config;
}

function logMessage(message, config) {
    const date = config.dateChalk(dateFormat(new Date(), config.dateFormat));
    const prependString = config.prependString ? config.chalk(config.prependString) : '';
    console.log(`${date} ${prependString}${config.chalk(message)}`);
}

function prepareLog(message, defaultConfig, oneTimeConfig, type) {
    if (!defaultConfig.get('disableLogging')) {
        if (Object.keys(oneTimeConfig).length > 0) {
            // eslint-disable-next-line max-len
            const configObject = parseConfigObject(defaultConfig.get(type).mergeDeep(fromJS(oneTimeConfig)).toJS());
            logMessage(message, configObject);
        } else {
            logMessage(message, defaultConfig.get(type).toJS());
        }
    }
}

class LogHelper {
    constructor() {
        this.config = fromJS({
            disableLogging: false,
            success: {
                chalk: chalk.green,
                prependString: null,
                dateChalk: chalk.white,
                dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'",
            },
            error: {
                chalk: chalk.bold.bgWhite.red,
                prependString: 'An Error occured: ',
                dateChalk: chalk.white,
                dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'",
            },
            status: {
                chalk: chalk.gray,
                prependString: null,
                dateChalk: chalk.white,
                dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'",
            },
            info: {
                chalk: chalk.cyan,
                prependString: null,
                dateChalk: chalk.white,
                dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'",
            },
            warning: {
                chalk: chalk.bold.yellow,
                prependString: null,
                dateChalk: chalk.white,
                dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'",
            },
        });
    }

    setConfig(configObject) {
        this.config = fromJS(parseConfigObject(this.config.mergeDeep(fromJS(configObject)).toJS()));
    }

    success(message, configObject = {}) {
        prepareLog(message, this.config, configObject, 'success');
    }

    error(message, configObject = {}) {
        prepareLog(message, this.config, configObject, 'error');
    }

    status(message, configObject = {}) {
        prepareLog(message, this.config, configObject, 'status');
    }

    info(message, configObject = {}) {
        prepareLog(message, this.config, configObject, 'info');
    }

    warning(message, configObject = {}) {
        prepareLog(message, this.config, configObject, 'warning');
    }
}

module.exports = new LogHelper();