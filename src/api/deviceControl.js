import request from '@/utils/request'

/**
 * 拉取设备
 * @param {Number} groupId 组id
 */
export function getDevice(groupId) {
  return request({
    url: `/projects/group/${groupId}`,
    method: 'get'
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
