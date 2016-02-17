var thrift = require('thrift');
var transport = thrift.TBufferedTransport();
var protocol = thrift.TBinaryProtocol();

var Message = require('./gen-nodejs/Message.js');
var ttypes = require('./gen-nodejs/nodejs_msg_types.js');

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  console.log(err)
});

var client = thrift.createClient(Message, connection);

var sendData = new ttypes.SendMsg()
sendData.content = 'hello world'
client.send(sendData, function(err, response) {
	if(err){
		return console.log(err)
	}
	console.log(response.result)
	console.log(response.id)
});
