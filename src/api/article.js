import request from '@/utils/request'

export function fetchList(data) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: 'mgr/list_table',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function deleteArticle(data) {
  return request({
    url: 'mgr/delete_table',
    method: 'post',
    data
  })
}

export function createArticle(data) {
  return request({
    // url: '/vue-element-admin/article/create',
    url: 'mgr/create_table',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    // url: '/vue-element-admin/article/update',
    url: 'mgr/modify_table',
    method: 'post',
    data
  })
}
