 struct User{  
     string uid,  
     string uname,  
     bool usex,  
     i16 uage,  
}  
service UserService{  
     void add(1: User u),  
     User get(1: string uid),  
}  
