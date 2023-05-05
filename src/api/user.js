import { 
	// get, 
	post,
	uploadFile
} from '../utils/request';

export function insertUserData(params) {
	return post('/SysUser/insert',params)
}

export function selectUserData(params) {
	return post('/SysUser/select',params)
}
export function updateUserData(params) {
	return post('/SysUser/update',params)
}

export function deleteUserData(params) {
	return post('/SysUser/delete',params)
}
export function getUserInfo(params) {
	return post('/SysUser/getUserInfo',params)
}

export function selectUserByRoleId(params) {
	return post('/SysUser/selectUserByRoleId',params)
}
export function login(params) {
	return uploadFile('/SysUser/login',params)
}

export function selectUserByDeptId(params) {
	return post('/SysUser/selectUserByDeptId',params)
}

export function selectAppUsers(params) {
	return post('/SysUser/selectAppUsers',params)
}

