function getData(req) {
    return new Promise((resolve, reject) => {
        let arr = [];
        req.on('data', function (data) {
            arr.push(data);
        });
        if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
            resolve({ "body": req.body })
        } else {
            req.on('end', function () {
                let data = decodeURI(Buffer.concat(arr));
                let onData = {};
                let post = {};
                let postArr = [];
                let files = {};
                let filesArr = [];
                let text = '', body = {};
                if (req.headers["content-type"]) {
                    console.log(data);
                    if (req.headers["content-type"] === "text/plain" || req.headers["content-type"] === "application/xml") {
                        text = data;
                    } else {
                        let str = req.headers["content-type"].split("; ")[1];
                        if (str) {
                            let boundary = "--" + str.split("=")[1];
                            let arr = data.split(boundary);
                            arr.shift();
                            arr.pop();
                            arr = arr.map(buffer => buffer.slice(2, buffer.length - 2));
                            arr.forEach(buffer => {
                                let n = buffer.indexOf("\r\n\r\n");
                                let disposition = buffer.slice(0, n);
                                let content = buffer.slice(n + 4); //内容从 \r\n\r\n 后面开始，所以n+4

                                disposition = disposition.toString();
                                if (disposition.indexOf("\r\n") == -1) {
                                    content = content.toString();
                                    let name = disposition.split("; ")[1].split("=")[1];
                                    name = name.substring(1, name.length - 1);
                                    post[name] = content;
                                    postArr.push({ name: content })
                                } else {
                                    let [line1, line2] = disposition.split("\r\n");
                                    let [, name, filename] = line1.split("; ");
                                    let type = line2.split("; ")[1];

                                    name = name.split("=")[1];
                                    name = name.substring(1, name.length - 1);

                                    filename = filename.split("=")[1];
                                    filename = filename.substring(1, filename.length - 1);
                                    filesArr.push({ name: name, filename: filename, type: type, "content": content });
                                }
                            })
                        }
                    }
                }
                onData.post = postArr;
                onData.files = filesArr;
                onData.text = text;
                onData.body = body;
                resolve(onData)
            })
        }
    });
}

module.exports = getData;