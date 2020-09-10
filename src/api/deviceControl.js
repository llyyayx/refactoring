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
 * @param { String } serialno 设备标识
 * @param { nameKey } serialno 设备属性标识
 * @param { String } week 几天之内
 * @param { Number } mode 模式 (1远程2本地)
 */
export function hist(serialno, nameKey, day, mode = 2) {
  let message = {}
  if (mode === 2) {
    message = {
      url: `/hist/${serialno}/${nameKey}/${day}`,
      method: 'get'
    }
  } else {
    message = {
      baseURL: 'php',
      url: `/api/statistics?serialno=${serialno}&namekey=${nameKey}&day=${day}`,
      method: 'get'
    }
  }
  return request(message)
}

/**
 * 查询喷灌机分区
 * @param { String } serialno 设备标识
 */
export function partition(serialno) {
  return request({
    url: `/cells/${serialno}`,
    method: 'get'
  })
}

/**
 * 添加计划
 * @param { Object } data 计划事件
 */
export function addPlan(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/plans/addPlan',
    method: 'post',
    data
  })
}

/**
 * 取消计划
 * @param {Number} planId 计划id
 */
export function cancelPlan(id) {
  return request({
    url: `/plans/${id}/cancel?forceDelete=0`,
    method: 'put'
  })
}

/**
 * 删除计划
 * @param {Number} planId 计划id
 */
export function delPlan(id) {
  return request({
    url: `/plans/${id}/cancel?forceDelete=1`,
    method: 'put'
  })
}

/**
 * 提交分区
 * @param { Array } data 分区信息
 */
export function subArea(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: `/cells/${data.serialno}`,
    method: 'post',
    data: data.cells
  })
}

/**
 * 上传土质分布文件
 */
export function subFile() {
  let baseURL
  // eslint-disable-next-line no-eval
  if (eval(process.env.VUE_APP_CROSS_DOMAIN)) {
    baseURL = process.env.VUE_APP_PROXY_API + process.env.VUE_APP_BASE_API
  } else {
    baseURL = process.env.VUE_APP_BASE_API
  }
  return baseURL + '/files/json'
}

/**
 * 读取上传的土质分布文件
 * @param { String } fileName 读取文件的名称
 */
export function readFile(fileName) {
  return request({
    url: `/files/json/${fileName}`,
    method: 'get'
  })
}

/**
 * 读取已上传土质分布文件列表
 *
 */
export function fileList() {
  return request({
    url: '/files/json',
    method: 'get'
  })
}

/**
 * 保存土质分布计算结果
 * @param { String } file 计算结果（图片）
 */
export function subResult(data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/files/result',
    method: 'post',
    data
  })
}

/**
 * 读取土质分布计算结果列表
 */
export function resultList() {
  return request({
    url: '/files/result',
    method: 'get'
  })
}

/**
 * 读取计算结果详情
 * @param { String } fileName 读取文件的名称
 */
export function resultCtn(fileName) {
  return request({
    url: `/files/result/${fileName}`,
    method: 'get'
  })
}
