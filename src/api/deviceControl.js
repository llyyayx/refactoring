import request from '@/utils/request'

/**
 * 拉取设备
 * @param {Number} groupId 组id
 */
export function getDevice(groupId) {
  return request({
    url: `/projects/group/${groupId}`,
    method: 'get',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}

/**
 * 控制设备
 * @param { Object } params 控制对象
 */
export function action(data) {
  return request({
    url: '/actions',
    method: 'post',
    data
  })
}

/**
 * 获取计划
 * @param { String } serialno 设备标识
 */
export function plans(serialno) {
  return request({
    url: `/plans/${serialno}`,
    method: 'get'
  })
}

/**
 * 查询设备状态
 * @param { String } serialno 设备标识
 */
export function real(serialno) {
  return request({
    url: `/real/${serialno}`,
    method: 'get'
  })
}

/**
 * 查询设备历史数据
 */
export function hist(serialno, nameKey, week) {
  return request({
    url: `/hist/${serialno}?name=${nameKey}&week=${week}`,
    method: 'get'
  })
}
