import { 
	// get, 
	post 
} from '../utils/request';

export function getAppInfo(params) {
	return post('/AppIndexController/selectAppInfo',params)
}

export function getStatisticAnalysis(params) {
	return post('/AppIndexController/selectStatisticAnalysis',params)
}


export function SysSelectDictionary(params) {
	return post('/SysSelectDictionary/select',params)
}