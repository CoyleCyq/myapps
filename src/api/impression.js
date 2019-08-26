import request from '@/utils/request'
const testAjaxUrl = 'http://localhost:7001/api'

export function fetchImpression(query) {
  return request({
    url: testAjaxUrl + '/impression/getImpression',
    method: 'get',
    params: query
  })
}

export async function fetchAllImpression() {
  return request({
    url: testAjaxUrl + '/impression/getAllImpression',
    method: 'get'
  })
}

export function addImpression(data) {
  return request({
    url: testAjaxUrl + '/impression/addImpression',
    method: 'post',
    data
  })
}

export function updateImpression(data) {
  return request({
    url: testAjaxUrl + '/impression/updateImpression',
    method: 'post',
    data
  })
}
