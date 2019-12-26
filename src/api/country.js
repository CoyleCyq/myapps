import request from '@/utils/request'

const testAjaxUrl = 'http://caoyuqi.cn:7001/api'
// const testAjaxUrl = 'http://localhost:7001/api'

export function getAllCountry(pageIndex, pageSize, condition) {
  const data = {
    pageIndex,
    pageSize,
    condition
  }
  return request({
    url: testAjaxUrl + '/country/getCountry',
    method: 'get',
    data
  })
}
