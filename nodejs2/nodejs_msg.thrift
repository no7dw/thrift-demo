struct SendMsg {
  1: string content,
}

struct ResMsg {
  1: i32 result = 1,
  2: i32 id,
}

service Message{
   ResMsg send(1:SendMsg data),
}
