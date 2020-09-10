import request from '@/utils/request'

/**
 * 获取已设置警报列表
 * @param { Object } param 参数对象
 * param.serialno { String } 设设备编号
 * param.startTime { String } 查找的开始时间
 * param.endTime { String } 查找的结束时间
 * param.pageSize { String } 第几页
 * param.limit { String } 一页几条
 */
export function alarmEvent(param) {
  return request({
    url: `alarms/${param.serialno}/${param.startTime}/${param.endTime}/${param.pageSize}/${param.limit}`,
    method: 'get'
  })
}
