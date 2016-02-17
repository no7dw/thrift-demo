//
// Autogenerated by Thrift Compiler (0.9.3)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = require('./nodejs_msg_types');
//HELPER FUNCTIONS AND STRUCTURES

Message_send_args = function(args) {
  this.data = null;
  if (args) {
    if (args.data !== undefined && args.data !== null) {
      this.data = new ttypes.SendMsg(args.data);
    }
  }
};
Message_send_args.prototype = {};
Message_send_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.data = new ttypes.SendMsg();
        this.data.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Message_send_args.prototype.write = function(output) {
  output.writeStructBegin('Message_send_args');
  if (this.data !== null && this.data !== undefined) {
    output.writeFieldBegin('data', Thrift.Type.STRUCT, 1);
    this.data.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Message_send_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = new ttypes.ResMsg(args.success);
    }
  }
};
Message_send_result.prototype = {};
Message_send_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.ResMsg();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Message_send_result.prototype.write = function(output) {
  output.writeStructBegin('Message_send_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

MessageClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this._seqid = 0;
    this._reqs = {};
};
MessageClient.prototype = {};
MessageClient.prototype.seqid = function() { return this._seqid; }
MessageClient.prototype.new_seqid = function() { return this._seqid += 1; }
MessageClient.prototype.send = function(data, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_send(data);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_send(data);
  }
};

MessageClient.prototype.send_send = function(data) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('send', Thrift.MessageType.CALL, this.seqid());
  var args = new Message_send_args();
  args.data = data;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

MessageClient.prototype.recv_send = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new Message_send_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('send failed: unknown result');
};
MessageProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
MessageProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

MessageProcessor.prototype.process_send = function(seqid, input, output) {
  var args = new Message_send_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.send.length === 1) {
    Q.fcall(this._handler.send, args.data)
      .then(function(result) {
        var result = new Message_send_result({success: result});
        output.writeMessageBegin("send", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("send", Thrift.MessageType.EXCEPTION, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.send(args.data, function (err, result) {
      if (err == null) {
        var result = new Message_send_result((err != null ? err : {success: result}));
        output.writeMessageBegin("send", Thrift.MessageType.REPLY, seqid);
      } else {
        var result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin("send", Thrift.MessageType.EXCEPTION, seqid);
      }
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}
