import request from '@/utils/request'
const testAjaxUrl = 'http://caoyuqi.cn:7001/api'

export function fetchDesignerShadow(query) {
  return request({
    url: testAjaxUrl + '/designerShadow/getDesignerShadow',
    method: 'get',
    params: query
  })
}

export async function fetchAllDesignerShadow() {
  return request({
    url: testAjaxUrl + '/designerShadow/getAllDesignerShadow',
    method: 'get'
  })
}

export function addDesignerShadow(data) {
  return request({
    url: testAjaxUrl + '/designerShadow/addDesignerShadow',
    method: 'post',
    data
  })
}

export function updateDesignerShadow(data) {
  return request({
    url: testAjaxUrl + '/designerShadow/updateDesignerShadow',
    method: 'post',
    data
  })
}
