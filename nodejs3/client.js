var thrift = require('thrift');
var transport = thrift.TBufferedTransport();
var protocol = thrift.TBinaryProtocol();

var UserService = require("./gen-nodejs/UserService");
var UserType = require("./gen-nodejs/User_types");

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  console.log(err)
});

var client = thrift.createClient(UserService, connection);

var userData = new UserType.UserInfo();
userData.name = "dengwei";
userData.age = 30;

client.add(userData, function(err, response) {
	if(err){
		return console.log(err)
	}
	console.log(response);
	process.exit(0);
});

