var thrift = require('thrift');
var transport = thrift.TBufferedTransport();
var protocol = thrift.TBinaryProtocol();


var UserService = require('./gen-nodejs/UserService.js'),
    ttypes = require('./gen-nodejs/user_types');

var connection = thrift.createConnection('localhost', 9090 
, {
  transport : transport,
  protocol : protocol
 }
);

var    client = thrift.createClient(UserService, connection);

var user = new ttypes.User();
user.uid=1;
user.name= "Mark Slee";
user.blurb = "I'll find something to put here.";

connection.on('error', function(err) {
  console.error(err);
});

client.add(user, function(err, response) {
  if (err) {
    console.error(err);
  } else {
    console.log("client stored:", user.uid);
  }
});
//client.get( user.uid, function(err, responseUser) {
//	if (err) {
//		console.error(err);
//	} else {
//		console.log("client retrieved:", responseUser.uid);
//		connection.end();
//	}
//});
