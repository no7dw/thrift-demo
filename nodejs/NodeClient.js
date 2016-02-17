var thrift = require('thrift');
var ThriftTransports = require('thrift/transport');
var ThriftProtocols = require('thrift/protocol');

transport = ThriftTransports.TBufferedTransport()
protocol = ThriftProtocols.TBinaryProtocol()

var UserService = require('./gen-nodejs/UserService.js'),
    ttypes = require('./gen-nodejs/user_types');

var connection = thrift.createConnection('localhost', 9090 
, {
  transport : transport,
  protocol : protocol
 }
);

var    client = thrift.createClient(UserService, connection);

var user = new ttypes.User({uid: 1,
                                   name: "Mark Slee",
                                   blurb: "I'll find something to put here."});

connection.on('error', function(err) {
  console.error(err);
});

client.add(1, user, function(err, response) {
  if (err) {
    console.error(err);
  } else {
    console.log("client stored:", user.uid);
  }
});
client.get(1, user.uid, function(err, responseUser) {
	if (err) {
		console.error(err);
	} else {
		console.log("client retrieved:", responseUser.uid);
		connection.end();
	}
});
