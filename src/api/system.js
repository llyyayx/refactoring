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
 * @param { String } param.phone 用户手机号
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
