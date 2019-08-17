import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/clothes/list',
    method: 'get',
    params: query
  })
}

export function fetchClothes(id) {
  return request({
    url: '/clothes/detail',
    method: 'get',
    params: { id }
  })
}

export function createClothes(data) {
  return request({
    url: '/clothes/create',
    method: 'post',
    data
  })
}

export function updateClothes(data) {
  return request({
    url: '/clothes/update',
    method: 'post',
    data
  })
}
