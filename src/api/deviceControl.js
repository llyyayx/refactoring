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
export function action(params) {
  return request({
    url: '/actions',
    method: 'post',
    params
  })
}
