import {
	// get, 
	post
} from '../utils/request';

// 新增轮播图（form表单传值）
export function insertData(params) {
	return post('/AppCarouselChart/insert', params)
}

export function selectData(params) {
	return post('/AppCarouselChart/select', params)
}
export function updateData(params) {
	return post('/AppCarouselChart/update', params)
}

export function deleteData(params) {
	return post('/AppCarouselChart/delete', params)
}
// 更新轮播图状态
export function updateState(params) {
	return post('/AppCarouselChart/updateState', params)
}

export function selectNews(params) {
	return post('/SysNotice/select', params)
}
export function insertNews(params) {
	return post('/SysNotice/insert', params)
}

export function updateStatus(params) {
	return post('SysNotice/updateStatus', params)
}

export function updateNotice(params) {
	return post('SysNotice/update', params)
}

export function deleteNotice(params){
	return post('SysNotice/delete',params)
}
export function deleteNews(params) {
	return post('/SysNotice/delete',params)
}