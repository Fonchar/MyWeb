
import { get, post } from './http'

export const BASE_URL = 'http://localhost:4000'

export const login = param => post(BASE_URL + '/login', param)
export const queryArticle = param => post(BASE_URL + '/query-article', param)

export const oneGet = param => get(BASE_URL + '/one-get', param)
