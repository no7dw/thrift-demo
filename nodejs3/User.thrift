struct UserInfo {
	1: i32 uid,
	2: string name,
	3: i32 age,
}

service UserService {
	i32 add(1: UserInfo user),
}

