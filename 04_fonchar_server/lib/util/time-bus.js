var assert = require('assert');

var schedule = require('node-schedule');

var mLog = require('../../log/log-helper.js');
var logger = mLog.getLogger();
assert(logger.info);

function hourlyRoutin(callback){
  var rule = new schedule.RecurrenceRule();
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    logger.info('one hourly routin start');
    try{
      return callback();
    }catch(e){
      logger.error(e);
    }
  });
}

function dailyRoutin(hour, callback, minute){
  var rule = new schedule.RecurrenceRule();
  rule.hour = hour;
  rule.minute = minute? minute: 0;
  schedule.scheduleJob(rule, function(){
    logger.info('one daily routin start');
    try{
      return callback();
    }catch(e){
      logger.error(e);
    }
  });
}

function weeklyRoutin(weekday, callback){
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = weekday; // 0 = Sunday
  rule.hour = 0;
  rule.minute = 0;
  schedule.scheduleJob(rule, function(){
    logger.info('one weekly routin start');
    try{
      return callback();
    }catch(e){
      logger.error(e);
    }
  });
}

module.exports.hourlyRoutin = hourlyRoutin;
module.exports.dailyRoutin  = dailyRoutin;
module.exports.weeklyRoutin = weeklyRoutin;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;