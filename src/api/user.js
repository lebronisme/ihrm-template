import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
/**
 *获取当前页面的信息
 * @returns
 */
export function getInfo () {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
