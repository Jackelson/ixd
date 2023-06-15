/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:29
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-15 21:56:25
 */
import { 
	// get, 
	post,
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
	return post('/SysUser/login',params)
}

export function selectUserByDeptId(params) {
	return post('/SysUser/selectUserByDeptId',params)
}

export function selectAppUsers(params) {
	return post('/SysUser/selectAppUsers',params)
}

