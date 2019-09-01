import request from '@/utils/request'
const testAjaxUrl = 'http://caoyuqi.cn:7001/api'
// const testAjaxUrl = 'http://localhost:7001/api'

export function fetchSuit(query) {
  return request({
    url: testAjaxUrl + '/suit/getSuit',
    method: 'get',
    params: query
  })
}

export async function fetchAllSuit() {
  return request({
    url: testAjaxUrl + '/suit/getAllSuit',
    method: 'get'
  })
}

export function addSuit(data) {
  return request({
    url: testAjaxUrl + '/suit/addSuit',
    method: 'post',
    data
  })
}

export function updateSuit(data) {
  return request({
    url: testAjaxUrl + '/suit/updateSuit',
    method: 'post',
    data
  })
}
