var mEmail = require('emailjs');


var configs = [{user: 'info@cnbmil.com', password: 'Aa123123', host: 'smtp.exmail.qq.com', ssl: true}];

//var emailWorkers = [];

var onOff = true;
if(onOff){
  demo();
}

function demo(){
  var worker = mEmail.server.connect(configs[0]);
  var emailFrom = configs[0].user;
  //var fileName = new Date().toLocaleDateString() + '.pdf';
  // var attchConf = null; //{path: './demo.pdf', type: 'application/pdf', name: fileName};
  var msg = {
    from: emailFrom,
    to: '2936322388@qq.com',
    subject: 'a test email',
    attachment: [{data: 'it is good to c u', alternative: true}]
  };
  worker.send(msg, function(err){
    if(err){
      return console.error(err);
    }
    console.log('ok');
  });
}