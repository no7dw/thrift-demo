# thrift demo

thrift 是一种RPC solution。相对于其它REST, SOAP。
怎么写thrift 接口， client & server 怎么写，见demo nodejs src [git][1]
解析：
先在xx.thrift 定义你的接口，你的传输的自定义结构体。

    #定义自定义结构体
    struct UserInfo {
    1: i32 uid,
    2: string name,
    3: i32 age,
    }
    #定义接口
    service UserService {
        i32 add(1: UserInfo user),
    }

看到struct之后，熟悉C/C++ 的同学可能会觉得很亲切。

ok. 接下来，

`$thrift -r --gen js:node User.thrift`

  -v[erbose]  Verbose mode
  -r[ecurse]  Also generate included files
  --gen 产生对应的调用的基础“sdk”，
  
譬如此命令执行完成后，产生出：gen-nodejs 文件夹
里面的代码是自动生成的，没必要去改。

# server 

    var thrift = require("thrift");
    var UserService = require("./gen-nodejs/UserService");
    var UserType = require("./gen-nodejs/User_types");
    var userArray = [];
    //step 1 定义server 的服务
    var server = thrift.createServer(UserService, {
        add: function(user, cb){
            user.uid = userArray.length+1;
            console.log(user);
            userArray.push(user);//传过来的内容用数据存储
            cb(null, user.uid);
        }
    }, {});
    server.listen(9090);


# client：
## step1 : 决定采用哪个protocal, 定义服务


    var thrift = require('thrift');
    var transport = thrift.TBufferedTransport();
    var protocol = thrift.TBinaryProtocol();
    
   
    var connection = thrift.createConnection("localhost", 9090, {
      transport : transport,
      protocol : protocol
    });

## step 2: 准备好数据
    
     var UserService = require("./gen-nodejs/UserService");
    var UserType = require("./gen-nodejs/User_types");
    
    var userData = new UserType.UserInfo();
    userData.name = "dengwei";
    userData.age = 30;

step 3: 真实的调用服务：

    var client = thrift.createClient(UserService, connection);
    
    client.add(userData, function(err, response) {
        if(err){
            return console.log(err)
        }
        console.log(response);
        process.exit(0);
    });



## 碰到的坑：
.thrift  文件：

 - struct 里面的1: 2: 不可忽略，数字递增 
 - service 里面的函数的变量1: 2: 不可忽略，数字递增

## 其它各种复杂的调用参考tutorial.thrift 的定义、含义。

## 运行：

    Wade@Deng:~/package/thrift-0.9.3/thrift-demo/nodejs3$ node server.js
    server listening
    { uid: 1, name: 'dengwei', age: 30 }
    { uid: 2, name: 'dengwei', age: 30 }
    { uid: 3, name: 'dengwei', age: 30 }

### client

    Wade@Deng:~/package/thrift-0.9.3/thrift-demo/nodejs3$ node client.js 
    1
    Wade@Deng:~/package/thrift-0.9.3/thrift-demo/nodejs3$ node client.js 
    2
    Wade@Deng:~/package/thrift-0.9.3/thrift-demo/nodejs3$ node client.js 
    3

 
ref:
[Apache Thrift - 可伸缩的跨语言服务开发框架][2]


  [1]: https://github.com/no7dw/thrift-demo
  [2]: https://www.ibm.com/developerworks/cn/java/j-lo-apachethrift/




