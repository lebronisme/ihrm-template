import request from '@/utils/request'
// 获取员工简单的列表
export function getSmployeesSimple () {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 * 获取员工的综合列表
 * ***/
export function getEmployeeList (params) {
  return request({
    url: '/sys/user',
    params
  })
}
// 根据ID删除角色
export function delEmployee (id) {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}
/** **
 *  新增员工的接口
 * **/
export function addEmployee (data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function importEmployee (data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
/** *
 * 给用户分配角色
 * ***/
export function assignRoles (data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
