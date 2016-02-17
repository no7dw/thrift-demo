var thrift = require("thrift");
var Message = require('./gen-nodejs/Message.js');
var ttypes = require('./gen-nodejs/nodejs_msg_types.js');


var count = 1
var server = thrift.createServer(Message, {
	
  send:function(data, cb){
	 console.log(data)
	 var resData = new ttypes.ResMsg();
	 resData.result = 1;
	 resData.id = count++;
	 cb(null, resData)
  }
}, {});

server.listen(9090);
