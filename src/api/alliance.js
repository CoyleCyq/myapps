import request from '@/utils/request'
import defaultSettings from '@/settings'
const { accessToken } = defaultSettings
const testAjaxUrl = 'http://caoyuqi.cn:7001/api'
// const testAjaxUrl = 'http://localhost:7001/api'

console.log('access', accessToken)

export function getAllData(query) {
  return request({
    url: testAjaxUrl + '/alliance/getAllData',
    method: 'get',
    params: query
  })
}

export function singleUpdate(data) {
  return request({
    url: testAjaxUrl + '/alliance/singleUpdate',
    method: 'post',
    data
  })
}

export function getImageData(data) {
  return request({
    url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + accessToken,
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
