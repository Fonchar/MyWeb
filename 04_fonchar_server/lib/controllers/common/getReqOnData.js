
var assert = require('assert')

//导入文件模块
var fs = require('fs');
//导入XML转换
// var xml2json = require('xml2json');
//导入路径模块

var logger = require('log-helper');

function getData(req, callback) {
    //创建空字符叠加数据片段
    let arr = [];

    console.log(req.headers["content-type"])

    //2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
    req.on('data', function (data) {
        // data 默认是一个二进制数据
        arr.push(data);
    });
    console.log(req.headers["content-type"])

    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
        return callback(null, { "body": req.body })
    } else {
        // 3.当接收表单提交的数据完毕之后，就可以进一步处理了
        //注册end事件，所有数据接收完成会执行一次该方法
        req.on('end', function () {
            console.log(req.headers["content-type"])

            //拼接二进制数据，并解码
            let data = decodeURI(Buffer.concat(arr));
            let onData = {};
            let post = {};
            let postArr = [];
            let files = {};
            let filesArr = [];
            let text = '', body = {};
            if (req.headers["content-type"]) {
                if (req.headers["content-type"] === "text/plain") {
                    text = data;
                } else {
                    let str = req.headers["content-type"].split("; ")[1];
                    if (str) {
                        //拼接出边界boundary
                        let boundary = "--" + str.split("=")[1];
                        //1. 用分割线切开数据
                        let arr = data.split(boundary);
                        //2. 丢弃头尾的数据
                        arr.shift();
                        arr.pop();
                        //3. 丢弃每一项中的\r\n
                        arr = arr.map(buffer => buffer.slice(2, buffer.length - 2));
                        //用第一次出现的\r\n\r\n切分数据
                        arr.forEach(buffer => {
                            let n = buffer.indexOf("\r\n\r\n");
                            let disposition = buffer.slice(0, n);
                            let content = buffer.slice(n + 4); //内容从 \r\n\r\n 后面开始，所以n+4
                            let contentJson;

                            disposition = disposition.toString();
                            //用描述信息里面是否存在"\r\n"区分普通数据和文件数据【普通数据没有"\r\n"】
                            if (disposition.indexOf("\r\n") == -1) {
                                //普通数据
                                content = content.toString();
                                let name = disposition.split("; ")[1].split("=")[1];
                                name = name.substring(1, name.length - 1);
                                post[name] = content;
                                postArr.push({ name: content })
                                // console.log("普通数据", post);
                            } else {
                                // 文件数据
                                let [line1, line2] = disposition.split("\r\n");
                                let [, name, filename] = line1.split("; ");
                                let type = line2.split("; ")[1];

                                name = name.split("=")[1];
                                name = name.substring(1, name.length - 1);

                                filename = filename.split("=")[1];
                                filename = filename.substring(1, filename.length - 1);
                                filesArr.push({ name: name, filename: filename, type: type, "content": content });
                                // let path = `public/upload/` + filename;
                                // console.log("写入的文件路径是：", path);
                                // fs.writeFile(path, content, (err) => {
                                //     if (err) {
                                //         console.log("写入文件失败了", err);
                                //     } else {
                                //         files[name] = { name, filename, path, type };
                                //         console.log("写入成功", files);
                                //         // res.end(xml2json.toJson(content))
                                //     }
                                // })
                            }
                        })
                    }
                }
            }
            onData.post = postArr;
            onData.files = filesArr;
            onData.text = text;
            onData.body = body;
            return callback(null, onData)
        });
    }
}

module.exports = getData;