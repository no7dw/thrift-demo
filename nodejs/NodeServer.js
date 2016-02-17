var thrift = require('thrift');

var UserService = require('./gen-nodejs/UserService.js'),
    ttypes = require('./gen-nodejs/user_types');	


var users = {};

var server = thrift.createServer(UserService, {
   add: function(user, callback) {
    console.log("server stored:", user.uname);
    users[user.uid] = user;
    callback();
  }
});

server.listen(7911);
console.log('server start');
