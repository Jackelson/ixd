/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:29
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-15 22:38:49
 */
import { 
	// get, 
	post 
} from '../utils/request';

export function getAppInfo(params) {
	return post('/AppIndexController/selectAppInfo',params)
}

export function getStatisticAnalysis() {
	return post('/AppIndexController/selectStatisticAnalysis')
}


export function SysSelectDictionary(params) {
	return post('/SysSelectDictionary/select',params)
}