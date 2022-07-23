import request from '@/utils/request'
/**
 * 获取角色列表
 * ***/
export function getRoleList (params) {
  return request({
    url: '/sys/role',
    params
  })
}
/**
 * 根据id获取公司信息
 * ***/
export function getCompanyInfo (companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
// 根据ID删除角色
export function deleteRole (id) {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}
// 根据ID更新角色
export function updateRole (data) {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}
// 根据ID获取角色详情
export function getRoleDetial (id) {
  return request({
    url: `sys/role/${id}`
  })
}
/** *
 * 新增角色
 * ***/
export function addRole (data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
