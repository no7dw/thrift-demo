 struct User{  
   1:  i32 uid,  
   2:  string uname,  
   3:  bool usex,  
   4:  i16 uage,  
}  
service UserService{  
    i32 add(1: User u),  
#    User get(1: string uid),  
}  
