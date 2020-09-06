
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

function base64DataSave(imgArr , basePathV0, callback) {
  return new Promise((resolve, reject) => {
  const basePath = '../..' + basePathV0;
  fs.mkdir(basePath, err =>{
    if (err) {
      console.log('有文件夹')
      
      console.log('req.body ', req.body)
      var imgArr = req.body.imgArr;
      if (imgArr.length) {
        imgArr.forEach((imgData, i)=>{
          if (Boolean(imgData)) {              
            //接收前台POST过来的base64
            //过滤data:URL
            var base64Data = imgData.miniurl.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            fs.writeFile(basePath +"/image_"+ i +".png", dataBuffer, function(err) {
                if(err){
                  res.send(err);
                }else{
                  res.send("保存成功！");
                }
            });              
          }
        })
      }
    } else {
    }
  })
  })  
}

async function asyncFromDataSave(req, res, basePathV0, prefix){
  const basePath = '../../public' + basePathV0;
  const form = new formidable.IncomingForm()
  // 设置存储文件的目录
  const imgPath = path.join(__dirname, basePath)
  // 如果目录不存在则创建
  if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath)
  form.uploadDir = imgPath
  // 上传文件大小限制
  form.maxFieldsSize = 20 * 1024 * 1024

  let result = await new Promise(resolve => {
    form.parse(req, function (err, fields, files) {
      if (err) {
        resolve({ err })
      } else {
        // 手动给文件加后缀, formidable默认保存的文件是无后缀的
        let newPath = files.file.path + '_' + files.file.name
        fs.renameSync(files.file.path, newPath)
        resolve({ path: newPath })
      }
    })
  })
  const basename = '/' + path.basename(result.path)
  console.log('basePath + basename', basePathV0 +  basename)  
  if (result.path) {
    res.send({state: 200, url:basePathV0  + basename})
  } else {
    res.send({state: 400, err: err})      
  }
}

const saveFiles = {
  base64DataSave:base64DataSave,
  asyncFromDataSave:asyncFromDataSave
}

module.exports.saveFiles = saveFiles;