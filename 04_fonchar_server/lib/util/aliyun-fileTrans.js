const Client = require('@alicloud/nls-filetrans-2018-08-17');

const { ALIYUN } =  require('../controllers/const');

function fileTrans(fileLink) {
    return new Promise((resolve, reject) => {
        /**
         * 地域ID
         * 常量内容，请勿改变
         */
        var ENDPOINT = 'http://filetrans.cn-shanghai.aliyuncs.com';
        var API_VERSION = '2018-08-17';
        /**
         * 创建阿里云鉴权client
         */
        var client = new Client({
            accessKeyId: ALIYUN.akID,
            secretAccessKey: ALIYUN.akSecret,
            endpoint: ENDPOINT,
            apiVersion: API_VERSION
        });
        /**
         * 提交录音文件识别请求，设置请求参数Task
         * 请求参数appkey：您的项目应用appkey
         * 请求参数file_link：需要识别的录音文件
         * 请求参数组合成JSON格式的字符串作为Task的值
         */
        var task = {
            appkey : ALIYUN.appKey,
            file_link : fileLink,
            version : '4.0',        // 新接入请使用4.0版本，已接入(默认2.0)如需维持现状，请注释掉该参数设置
            enable_words : false     // 设置是否输出词信息，默认为false，开启时需要设置version为4.0
        };
        task = JSON.stringify(task);
        var taskParams = {
            Task : task
        };
        var options = {
                method: 'POST'
            };
        // 提交录音文件识别请求，处理服务端返回的响应
        client.submitTask(taskParams, options).then((res) => {
            console.log('录音文件识别请求响应开始');
            // 服务端响应信息的状态描述 StatusText
            var status = res.StatusText;
            if (status != 'SUCCESS') {
                console.log('录音文件识别请求响应失败!');
                return reject(res);
            }
            // 获取录音文件识别请求任务的TaskId，以供识别结果查询使用
            var taskId = res.TaskId;
            /**
             * 以TaskId为查询参数，提交识别结果查询请求
             * 以轮询的方式进行识别结果的查询，直到服务端返回的状态描述为"SUCCESS"、SUCCESS_WITH_NO_VALID_FRAGMENT，
             * 或者为错误描述，则结束轮询。
            */
            var taskIdParams = {
                TaskId : taskId
            };
            var timer = setInterval(() => {
                client.getTaskResult(taskIdParams).then((response) => {
                    var statusText = response.StatusText;
                    console.log(response);
                    if (statusText == 'RUNNING' || statusText == 'QUEUEING') {
                        // 继续轮询，注意间隔周期为3秒
                    }
                    else {
                        if (statusText == 'SUCCESS' || statusText == 'SUCCESS_WITH_NO_VALID_FRAGMENT') {
                            console.log('录音文件识别成功：');
                            //var sentences = response.Result;
                            resolve(response);
                        }
                        else {
                            console.log('录音文件识别失败!');
                            reject(response);
                        }
                        // 退出轮询
                        clearInterval(timer);
                    }
                }).catch((error) => {
                    // 异常情况，退出轮询
                    clearInterval(timer);
                    return reject(error);
                });
            }, 3000);
        }).catch((error) => {
            return reject(error);
        });
    });
}

module.exports = fileTrans;