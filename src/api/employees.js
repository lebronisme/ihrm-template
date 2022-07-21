import request from '@/utils/request'
// 获取简单的员工信息
export function getSmployeesSimple () {
  return request({
    url: '/sys/user/simple'
  })
}
