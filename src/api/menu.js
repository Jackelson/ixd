import { 
	// get, 
	post 
} from '../utils/request';

export function selectAllMenu(params) {
	return post('/SysMenu/select',params)
}

export function deleteMenuData(params) {
	return post('/SysMenu/delete',params)
}

export function insertMenuData(params) {
	return post('/SysMenu/insert',params)
}

export function updateMenuData(params) {
	return post('/SysMenu/update',params)
}

export function queryMenuData(params) {
	return post('/SysMenu/selectMenuTreeByRoleId',params)
}