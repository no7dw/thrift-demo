var thrift = require("thrift");
var UserService = require("./gen-nodejs/UserService");
var UserType = require("./gen-nodejs/User_types");
var bluebird = require('bluebird')
var userArray = [];
var server = thrift.createServer(UserService, {
  add: function(user, cb){
  //  var resData = new UserType.UserInfo();
  //  resData = user;
    user.uid = userArray.length+1;
    console.log(user);
    userArray.push(user);
    // cb(null, user.uid); //case 1 
    //case 2 simulate a delay  -- will have a event base effect
    bluebird.delay(5000).then(function(){
      cb(null, user.uid);
    })
  }
}, {});

server.listen(9090);
console.log("server listening");
