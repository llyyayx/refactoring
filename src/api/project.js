import request from '@/utils/request'

/**
 * 修改项目信息
 * @param { data } data 表单内容
 */
export function updateMsg(data) {
  return request({
    url: `/projects/${data.id}`,
    method: 'put',
    data
  })
}
