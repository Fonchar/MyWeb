var assert = require('assert');

var logger = require('../log/log.js').logger;
assert(logger);

var mArticle = require('../lib/controllers/article/article.js');

function saveArticle(app){
  app.post('/save-article',async (req, res)=>{
    let saveFlag = await mArticle.saveArticle(req.body)
    console.log('saveFlag ',  saveFlag)
    if (saveFlag) {
      res.send({state: 200, msg: '提交成功！'})      
    } else {
      res.send({state: 400, msg: '提交失败！'})
    }
    res.end()
  })
}

function queryArticle(app){
  app.all('/query-article',async (req, res)=>{
    console.log('get req.method  ',  req.method )
    console.log('get req.query ',  req.query)
    console.log('get req.params ',  req.params)
    console.log('get req.body ',  req.body)
    let body = ''
    if (req.method === 'GET') {
      body = req.query
    } else {
      body = req.body
    }
    let queryData = await mArticle.queryArticle(body)
    console.log('queryData ',  queryData)
    if (queryData) {
      res.send({state: 200, msg: '查询成功！', data:queryData})      
    } else {
      res.send({state: 400, msg: '查询失败！'})
    }
    res.end()
  })
}

module.exports = function(app){
  saveArticle(app);
  queryArticle(app);
};

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;