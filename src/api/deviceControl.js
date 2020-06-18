import request from '@/utils/request'

export function getDevice(groupId) {
  return request({
    url: `/projects/group/${groupId}`,
    method: 'get'
  })
}
