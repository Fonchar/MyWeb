var assert = require('assert');

var schedule = require('node-schedule');
var mLog = require('../../../log/log-helper');
var logger = mLog.getLogger();
assert(logger.info);


const {listenerPushMark} = require('../pushAllData/pushAllData');

//schedule.scheduleJob('20 * * * *', function());
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
// * 号为通配符

function handlerPushAllData() {
  // logger.info('FLUX WMS推送 定时任务已经开启，30s 推送一次');
  // schedule.scheduleJob('0,30 * * * * *', () => {
  //   listenerPushMark()
  // });

  logger.info('FLUX WMS推送 定时任务已经开启，5分钟 推送一次');
  schedule.scheduleJob('0 0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
    listenerPushMark()
  });
}

const init = () => {
  // handlerPushAllData()
};

init();