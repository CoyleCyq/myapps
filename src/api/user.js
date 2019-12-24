import request from '@/utils/request'

const testAjaxUrl = 'http://caoyuqi.cn:7001/api'
// const testAjaxUrl = 'http://localhost:7001/api'

export function login(data) {
  return request({
    url: testAjaxUrl + '/account/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: testAjaxUrl + '/account/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: testAjaxUrl + '/account/logout',
    method: 'post'
  })
}
