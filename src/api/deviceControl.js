import request from '@/utils/request'

export function getDevice(groupId) {
  console.log(request.baseURL)
  return request({
    url: `/projects/group/${groupId}`,
    method: 'get'
  })
}
