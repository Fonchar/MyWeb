# Log Helper

This highly configurable package offers some functions which help you to understand your console logs by colorizing the output and providing the current date.

## Installation

```npm i log-helper --save```

## Usage

There are 6 functions available:

* ```success(message, config)```
* ```info(message, config)```
* ```status(message, config)```
* ```warning(message, config)```
* ```error(message, config)```
* ```setConfig(config)```

Each logged message looks like the following:

currentDate + prependString + message;

All of this output is colored via the [chalk](https://github.com/chalk/chalk) package, and the color of the output is the main difference of all this functions.

### Example

```javascript
const logHelper = require('log-helper)';
const http = require('someFancyHttpModule');

logHelper.status('Start fetching http data');
http.get('https://jsonplaceholder.typicode.com/posts/1').then((data) => {
    logHelper.success('Successfully fetched http data');
    if (data) {
        logHelper.info(`The data is: ${data}`);
    } else {
        logHelper.warning(`Empty data`);
    }
}).catch((error) => {
    logHelper.error(`Oh no! Something went wrong while fetching http data: ${error}`);
});
```

## Configuration

Every function has the following configuration options:

* ```chalk```: This is a string which defines the color of the message output.
* ```dateChalk```: This is also a string, which defines the color of the current date.
* ```prependString```: You can provide a string which automatically gets inserted between the current date and the message.
* ```dateFormat```: This string defines in which format the date of the output gets logged.

NOTE: You do not have to configurate any of this options yourself, only if you don't like the default configuration.

To configurate the ```chalk```or the ```dateChalk``` option, you do not have to directly use the [chalk](https://github.com/chalk/chalk) package. Instead, provide a string where each chalk option is separated with a dot. For example, if you want your message in a green, bold font, use the following as a config object:

```javascript
{
    chalk: 'bold.green'
}
```

To what style options are available, have a look at the [chalk](https://github.com/chalk/chalk) package.

The date formatting work is done by the [dateformat](https://github.com/felixge/node-dateformat) package. Have a look at the documentation to see the available format options.

There are two ways to configurate this package. You can either provide a config object as a second parameter in each if the five logging functions, or use the ```setConfig``` method. But there is a difference between these two ways: The first way will only configurate the message provided as the first parameter, while the second way will overwrite the default configuration.

```javascript
const logHelper = require('log-helper');

// will be logged in the default green font
logHelper.success('It works!');

// will be logged in blue font
logHelper.success('It works!', {
    chalk: 'blue'
});

// will be logged in the default green font
logHelper.success('It works');

// now the default chalk setting for the success function will be overwritten
logHelper.setConfig({
    success: {
        chalk: 'bgBlack.white'
    }
});

// will be logged in a white font on black background
logHelper.success('It works');

// it is also possible to configurate multiple output functions at one time
logHelper.setConfig({
    error: {
        prependString: 'Oh no, there was an error: '
    },
    status: {
        chalk: 'bgWhite.bold.cyan',
        dateFormat: 'mm/dd/yyyy HH:MM:ss'
    },
    info: {
        dateChalk: 'bold.gray',
        prependString: '(Info): '
    }
})
```

If you use the ```setConfig``` method, the configuration will be used in your whole project:

```javascript
// firstFile.js
const logHelper = require('log-helper');

logHelper.setConfig({
    success: {
        chalk: 'yellow'
    }
});

// secondFile.js
const logHelper = require('log-helper');

// will be logged in a yellow font
logHelper.success('It works!');
```

If you want to disable logging, use the ```setConfig``` method:
```javascript
const logHelper = require('log-helper');

logHelper.setConfig({
    disableLogging: true
});

// will not be logged
logHelper.error('ERROR!');
```

### Default configuration

This is the default configuration of all five logging functions.

```javascript
{
    disableLogging: false,
    success: {
        chalk: 'green',
        dateChalk: 'white',
        prependString: null,
        dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'"
    },
    info: {
        chalk: 'cyan',
        dateChalk: 'white',
        prependString: null,
        dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'"
    },
    status: {
        chalk: 'gray',
        dateChalk: 'white',
        prependString: null,
        dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'"
    },
    warning: {
        chalk: 'bold.yellow',
        dateChalk: 'white',
        prependString: null,
        dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'"
    },
    error: {
        chalk: 'green',
        dateChalk: 'bold.bgWhite.red',
        prependString: 'An error occured: ',
        dateFormat: "dd.mm.yyyy HH:MM:ss l'ms'"
    }
}
```