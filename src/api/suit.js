import request from '@/utils/request'
const testAjaxUrl = 'http://localhost:7001/api'

export function fetchList(query) {
  return request({
    url: testAjaxUrl + '/suit/getSuit',
    method: 'get',
    params: query
  })
}

export function fetchSuit(id) {
  return request({
    url: '/suit/detail',
    method: 'get',
    params: { id }
  })
}

export function createSuit(data) {
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
