import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function userList() {
  return request({
    url: 'users/',
    method: 'get'
  })
}

/**
 * 更改用户信息
 * @param { Object } param.data 提交的信息
 * @param { String } param.phone 用户手机号
 */
export function userMsg(param) {
  return request({
    url: `users/${param.phone}`,
    method: 'put',
    data: param.data
  })
}

/**
 * 添加用户
 * @param { Object } param.data 提交的信息
 */
export function addUser(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'users/',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param { String } param.phone 用户手机号
 */
export function delUser(phone) {
  return request({
    url: `users/${phone}`,
    method: 'delete'
  })
}

/**
 * 修改设备信息
 * @param { Object } serialno 设备编号
 * @param { Object } data 提交的信息
 */
export function deviceMsg(serialno, data) {
  return request({
    url: `devices/${serialno}`,
    method: 'put',
    data
  })
}

/**
 * 添加警报
 * @param { Object } param.data 提交的信息
 */
export function addAlarm(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'alarmrule',
    method: 'post',
    data
  })
}

/**
 * 获取已设置警报列表
 * @param { Object } param 参数对象
 * param.serialno { String } 设设备编号
 * param.startTime { String } 查找的开始时间
 * param.endTime { String } 查找的结束时间
 * param.pageSize { String } 第几页
 * param.limit { String } 一页几条
 */
export function listAlarm(param) {
  return request({
    url: `alarmrules/${param.serialno}/${param.startTime}/${param.endTime}/${param.pageSize}/${param.limit}`,
    method: 'get'
  })
}

/**
 * 删除警报
 * @param { Number } id 警报id
 */
export function delAlarm(id) {
  return request({
    url: `alarmrule/${id}`,
    method: 'delete'
  })
}

/**
 * 修改警报
 * @param { Number } id 警报id
 */
export function updateAlarm(id, data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: `alarmrule/${id}`,
    method: 'put',
    data
  })
}
