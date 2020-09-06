var assert = require('assert');

var mPAGESIZE = require('../../../config/index.js').PAGESIZE;
var logger = require('../../../log/log.js').logger;
var db = require('../../db/db.js');
assert(db.excuteSql);

async function saveArticle(data) {
  // console.log('data ', data)
  let classId = await handedArticleClass(data);
  data.classId = classId
  let tagsId = await handedArticleTag(data);
  data.tagsId = tagsId
  let mdId = await handedArticleMd(data);
  data.mdId = mdId
  let htmlId = await handedArticleHtml(data);
  data.htmlId = htmlId
  let authorId = await handedArticleAuthorId(data);
  data.authorId = authorId
  let articleFlag = await handedSaveArticle(data);
  return articleFlag
}


function handedSaveArticle(data) {
  /* 
  title varchar(255),
  date date NOT NULL,  
  author varchar(255),
  class_id int NOT NULL default 0,
  tags_id varchar(255),
  types int(10) NOT NULL default 0 comment '文章类型 0：发布私密，1：发布公开，3:VIP可见',
  state int(10) NOT NULL default 0 comment '文章状态 0：草稿，1：发布， 2：作废',
  md_id int NOT NULL,
  html_id int NOT NULL */

  return new Promise((resolve, reject) => {
    let sql = [
      'insert into tb_article (title, date, author, class_id, tags_id, types, state, md_id, html_id)',
      'values (?,?,?,?,?,?,?,?,?)'
    ].join(' ');
    let val = [data.title, new Date(), data.authorId, data.classId, data.tagsId, data.form.type, data.form.state, data.mdId, data.htmlId];
    db.excuteSql(sql, val, function (aerr, okPacket) {
      if (aerr) {
        logger.error(aerr);
        resolve(false)
      }
      if (okPacket.affectedRows > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

function handedArticleMd(data) {
  return new Promise((resolve, reject) => {
    let sql = 'insert into tb_article_md (data) values ("' + encodeURI(data.md) + '")';
    db.excuteSql(sql, function (err, okPacket) {
      if (err) {
        logger.error(err);
        resolve(false)
      }
      resolve(okPacket.insertId)
    })
  })
}

function handedArticleHtml(data) {
  return new Promise((resolve, reject) => {
    let sql = 'insert into tb_article_html (data) values ("' + encodeURI(data.html) + '")';
    db.excuteSql(sql, function (err, okPacket) {
      if (err) {
        logger.error(err);
        resolve(false)
      }
      resolve(okPacket.insertId)
    })
  })
}

function handedArticleClass(data) {
  return new Promise((resolve, reject) => {
    let sql = 'select * from tb_article_classes where first_class = ?';
    let val = [data.form.class];
    db.excuteSql(sql, val, function (cerr, rows) {
      if (cerr) {
        logger.error(cerr);
        resolve(false)
      }
      resolve(rows[0].id)
    })
  })
}

function handedArticleTag(data) {
  return new Promise((resolve, reject) => {
    let tagsId = '';
    let sql = 'select * from tb_article_tags where name in (' + '"' + data.form.tags.join('","') + '"' + ')';
    db.excuteSql(sql, function (terr, rows) {
      if (terr) {
        logger.error(terr);
        resolve(false)
      }
      if (rows.length > 0) {
        rows.forEach((item, index) => {
          index == 0 ? (tagsId += item.id) : (tagsId += ',' + item.id)
        })
        resolve(tagsId)
      } else {
        resolve(false)
      }
    })
  })
}

function handedArticleAuthorId(data) {
  return new Promise((resolve, reject) => {
    resolve(1)
  })
}

async function queryArticle(data) {
  if (data.id) {
    let articleData = {};
    let articleBase = await handedQueryArticle(data)
    let author = await handedQueryArticleAuthor(articleBase.author)
    let md = await handedQueryArticleMd(articleBase.md_id)
    let html = await handedQueryArticleHtml(articleBase.html_id)
    articleData = articleBase
    articleData.author = author
    articleData.md = md
    articleData.html = html
    return articleData
  } else {
    return await handedQueryArticleList(data)
  }
}

function handedQueryArticle(data) {
  return new Promise((resolve, reject) => {
    let sql = ['select * from tb_article where id = ?'].join(' ');
    let val = [data.id];
    db.excuteSql(sql, val, async function (qerr, qData) {
      if (qerr) {
        logger.error(qerr);
        resolve(false)
      }
      console.log('qData------------------------------------', qData)
      let tags = await handedQueryArticleTags(qData[0].tags_id)
      qData[0].tags = tags
      resolve(qData[0])
    })
  })
}

function handedQueryArticleMd(id) {
  return new Promise((resolve, reject) => {
    let sql = ['select data from tb_article_md where id = ?'].join(' ');
    let val = [id];
    db.excuteSql(sql, val, function (qmerr, qmData) {
      if (qmerr) {
        logger.error(qmerr);
        resolve(false)
      }
      resolve(qmData[0].data)
    })
  })
}

function handedQueryArticleHtml(id) {
  return new Promise((resolve, reject) => {
    let sql = ['select data from tb_article_html where id = ?'].join(' ');
    let val = [id];
    db.excuteSql(sql, val, function (qherr, qhData) {
      if (qherr) {
        logger.error(qherr);
        resolve(false)
      }
      resolve(qhData[0].data)
    })
  })
}

function handedQueryArticleAuthor(id) {
  return new Promise((resolve, reject) => {
    let sql = ['select name from tb_user where id = ?'].join(' ');
    let val = [id];
    db.excuteSql(sql, val, function (querr, quData) {
      if (querr) {
        logger.error(querr);
        resolve(false)
      }
      resolve(quData[0].name)
    })
  })
}

function handedQueryArticleTags(data) {
  return new Promise((resolve, reject) => {
    let tags = '';
    let sql = 'select * from tb_article_tags where id in (' + '"' + data.split(',').join('","') + '"' + ')';
    console.log(sql)
    db.excuteSql(sql, function (terr, rows) {
      if (terr) {
        logger.error(terr);
        resolve(false)
      }
      if (rows.length > 0) {
        rows.forEach((item, index) => {
          index == 0 ? (tags += item.name) : (tags += ',' + item.name)
        })
        resolve(tags)
      } else {
        resolve(false)
      }
    })
  })
}

function handedQueryArticleList(data) {
  return new Promise((resolve, reject) => {
    let sql = [
      'select a.id, title, date, u.name author, u.id uer_id, class_id, tags_id, types, state, md_id, html_id',
      'from tb_article a, tb_user u where u.id = a.author limit ? '
    ].join(' ');
    let val = [];
    if (data.pageNumber && data.pageSize) {
      val = [data.pageNumber + ',' + data.pageSize]
    } else {
      val = [mPAGESIZE]
    }
    db.excuteSql(sql, val, function (qerr, qData) {
      if (qerr) {
        logger.error(qerr);
        resolve(false)
      }
      resolve(qData)
    })
  })
}


module.exports.saveArticle = saveArticle;
module.exports.queryArticle = queryArticle;