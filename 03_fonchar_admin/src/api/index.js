import { get, post } from './http'
import request from '../request/request';

export const BASE_URL = 'http://localhost:4000'

export const login = param => post( BASE_URL + '/login', param)
export const upload = param => post( BASE_URL + '/upload', param)
export const saveArticle = param => post( BASE_URL + '/save-article', param)
export const queryArticle = param => post( BASE_URL + '/query-article', param)
export const api2 = param => get('https://xxx/v5/weather?city=taian&key=1b47b16e4aa545eaa55a66f859ac0089', param)
export const api3 = param => post('https://xxx/svserver/upload/', param)

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
