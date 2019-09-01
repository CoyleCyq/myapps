import request from '@/utils/request'
const testAjaxUrl = 'http://caoyuqi.cn:7001/api'
// const testAjaxUrl = 'http://localhost:7001/api'

export function fetchClothes(query) {
  return request({
    url: testAjaxUrl + '/clothes/getClothes',
    method: 'get',
    params: query
  })
}

export function fetchAllClothes() {
  return request({
    url: testAjaxUrl + '/clothes/getAllClothes',
    method: 'get'
  })
}

export function addClothes(data) {
  return request({
    url: testAjaxUrl + '/clothes/addClothes',
    method: 'post',
    data
  })
}

export function updateClothes(data) {
  return request({
    url: testAjaxUrl + '/clothes/updateClothes',
    method: 'post',
    data
  })
}
