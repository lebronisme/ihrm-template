import request from '@/utils/request'
// 封装的 获取公司组织架构的api接口
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}
/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 *删除部门 **/
export function delDepartments (id) {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
// 新增部门
export function addDepartments (data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}
// 获取某个部门详情
export function getOneDepartDetail (id) {
  return request({
    url: `/company/department/${id}`
  })
}
/**
 * 编辑部门
 *
 * ***/
export function updateDepartments (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
