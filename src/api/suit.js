import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/suit/list',
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
    url: '/suit/create',
    method: 'post',
    data
  })
}

export function updateSuit(data) {
  return request({
    url: '/suit/update',
    method: 'post',
    data
  })
}
