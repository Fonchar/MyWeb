const assert = require('assert');
const TextToSVG = require('text-to-svg');
const sharp = require('sharp');
const {resolve} = require('path');

var mErr = require('../err.js');
var errCodes = mErr.codes;
assert(errCodes);
var wrapSSErr = mErr.wrapSSErr;
assert(wrapSSErr);

//text-to-svg 默认配置
const fontSize  = 24;                             //字体大小
const fill      = 'red';                          //字体颜色
const anchor    = 'top';                          //锚点 只可选择top 勿改
const stroke    = '#f60';                         //描边
const fontPath  = '../../public/font/simhei.ttf'; //字体

/**
 * @param {String} str                    水印文本
 * @param {Object | 可选参数} opt          配置 如字体大小 颜色
 */
const strToSVG = (text, opt = {}) => {
  const textToSVG = TextToSVG.loadSync(resolve(__dirname, fontPath));

  opt.fontSize = opt.fontSize != undefined ? opt.fontSize : fontSize;
  opt.anchor = opt.anchor != undefined ? opt.anchor : anchor;
  opt.attributes = opt.attributes != undefined ? opt.attributes : {};
  opt.attributes.stroke = opt.attributes.stroke != undefined ? opt.attributes.stroke : stroke;
  opt.attributes.fill = opt.attributes.fill != undefined ? opt.attributes.fill : fill;

  return Buffer.from(textToSVG.getSVG(text, opt));
};

/**
 * @param {Buffer} bufferFile           二进制流文件
 * @param {String} str                  水印文字
 * @param {String} outPath              完成后图片保存路径
 * @param {String} gravity              水印位置 centre | north | south | northeast ...(上北下南 左西右东)
 * @param {Object} opt                  水印字体大小 颜色 可选传参
 */
const drawText = (bufferFile, text,outPath, gravity = 'southeast', opt) => {
  return new Promise((res, rej) => {
    sharp(bufferFile)
      .composite([{ input: strToSVG(text, opt), gravity: gravity }])
      .toFile(outPath, (err, info) => {
        if(err){
          return  rej(wrapSSErr('ERROR: Image added watermark failed',errCodes.ADD_WATER_ERROR));
        }
        res(info);
      });
  });
};

module.exports = drawText;