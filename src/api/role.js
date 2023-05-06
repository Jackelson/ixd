import { 
	// get, 
	post 
} from '../utils/request';

export function insertRoleData(params) {
	return post('/SysRole/insert',params)
}

export function selectRoleData(params) {
	return post('/SysRole/select',params)
}
export function updateRoleData(params) {
	return post('/SysRole/update',params)
}

export function deleteRoleData(params) {
	return post('/SysRole/delete',params)
}
export function selectAllRole(params) {
	return post('/SysRole/selectAllRole',params)
}

export function updateRoleMenu(params) {
	return post('/SysRole/updateRoleMenu',params)
}
export function selectRoleByDeptId(params) {
	return post('/SysRole/selectRoleByDeptId',params)
}

export function selectMenuTree(params) {
	return post('/SysMenu/selectMenuTree',params)
}

export function selectMenuTreeByRoleId(params) {
	return post('/SysMenu/selectMenuTreeByRoleId',params)
}
