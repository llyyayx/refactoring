import store from '@/store'
import area from '../area'
import { sprayValve } from './sprayValve'
import mapFun from '@/utils/mapFun'
import { version } from 'mockjs'

// 解析喷灌
export function spray(item) {
  const { dname, latitude, longitude, dclass, serialno, extension, portarrays, cells, model } = item
  // 绘制喷灌圈
  let canvas = {}
  if (cells) {
    canvas = draw({ latitude, longitude, extension, cells })
  }
  // 地图标点
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/run/pg.png') })
  clickEvent(mapSpot)

  // vuex管理
  console.log(getCommand(model))
  store.dispatch('device/setSpray', { dname, latitude, longitude, dclass, serialno, extension, canvas,
    mapSpot, attr: getAttr(model), icon: require('@/icons/device/run/pg.png'), command: getCommand(model) })
  if (portarrays) sprayValve(portarrays, { dname })
}

// 绘制喷灌圈
function draw(param) {
  let id
  const cells = param.cells
  const partition = []
  const big = { smallArea: [] }
  cells.forEach((el, index) => {
    if (index !== 0 && id !== el.id) {
      partition.push(JSON.parse(JSON.stringify(big)))
      big.smallArea = []
    }
    id = el.id
    big.lfAng = el.argstart
    big.rgAng = el.argend
    big.num = el.id
    big.bigColor = el.color
    const small = {}
    small.lfrad = el.disstart
    small.rgrad = el.disend
    small.num = el.name
    small.smallColor = el.color
    big.smallArea.push(small)
    if (index === cells.length - 1) {
      partition.push(JSON.parse(JSON.stringify(big)))
    }
  })
  var extension = JSON.parse(param.extension.replace(/"/g, ' ').replace(/'/g, '"'))
  var long = extension.arm || 150
  var lngC = 40030173
  var hu = param.latitude.split('.')[0] * Math.PI / 180
  var latC = 40030173 * Math.cos(hu)
  var lngM = (360 / latC) * long
  var latM = (360 / lngC) * long
  var swSpot = { lat: (parseFloat(param.latitude) - latM), lng: parseFloat(param.longitude) - lngM }
  var neSpot = { lat: parseFloat(param.latitude) + latM, lng: parseFloat(param.longitude) + lngM }
  // 3、绘制喷灌机canvas对象
  // eslint-disable-next-line new-cap
  const view = new area.region({
    swSpot: swSpot,
    neSpot: neSpot,
    canvasId: 'myCan',
    lineWidth: 1,
    pgAngle: 60,
    pgWidth: 3,
    pgColor: 'rgba(132,209,73,1)',
    coreColor: '#000',
    coreRadii: 5,
    complete: { start: 0, end: 0 },
    mapAdd: false,
    mapObj: store.state.map.map,
    mapHorizontalSpacing: 200,
    textShow: true,
    displayDirection: true,
    direction: true,
    allArea: partition,
    arm: long,
    allNozzle: 40
  })
  return view
}

/**
 * 创建地图标点
 * @param { Object } obj 点参数
 * obj.lat 纬度
 * obj.lng 经度
 * icon 图标
 */
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/**
 * 标点点击事件
 * @param { Object } mapSpot 地图标点实例化对象
 */
function clickEvent(mapSpot) {
  mapFun.marKerClickEvent(mapSpot, () => {
    store.dispatch('control/sprayShow', true)
  })
}

/* -----------------------属性装载-------------------------- */

/**
 * @param { String } version 设备版本
 * @return { Array } 属性列表
 */
function getAttr(version) {
  const attribute = []
  attr.forEach((el, index) => {
    if (el.version[0] === '*' || el.version.includes(version)) {
      el.nameKey = getNameKey(el.mark, version)
      el.rules = getRules(el.mark, version)
      attribute.push(el)
    }
  })
  return attribute
}

/**
 * 方法：根据版本得到属性的nameKey
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { String } 与设备版本对应的nameKey
 */
function getNameKey(mark, version) {
  let key
  nameKey.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        key = el.key
      }
    }
  })
  return key
}

/**
 * 方法：根据版本得到对应的规则（注意规则生效时，nameKey的值将被该方法返回值覆盖）
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { Function } 与设备版本对应的规则
 */
function getRules(mark, version) {
  let fun = false
  rules.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        fun = el.fun
      }
    }
  })
  return fun
}

function stateIcon(el, vueX) {
  let icon
  if (el === '运行') {
    icon = require('@/icons/device/run/pg.png')
  } else {
    icon = require('@/icons/device/close/pg.png')
  }
  vueX.icon && (vueX.icon = icon)
  vueX.mapSpot && vueX.mapSpot.setIcon(icon)
}

// 属性
const attr = [
  {
    mark: 'sprayState',
    name: '设备状态',
    type: 'boolean',
    // 转换nameKey得到值
    dataFun: (el) => {
      return el ? '运行' : '停止'
    },
    nameKey: '',
    val: '启动',
    unit: '',
    // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
    rules: false,
    callback: [stateIcon],
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'sprayModel',
    name: '运行模式',
    type: 'boolean',
    dataFun: (el) => {
      return el ? '远程' : '本地'
    },
    nameKey: '',
    val: '本地',
    unit: '',
    rules: false,
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'sprayPwm',
    name: '行走速率',
    type: 'Number',
    dataFun: (el) => {
      return el
    },
    nameKey: '',
    val: '100',
    unit: '%',
    rules: false,
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'sprayAngle',
    name: '当前角度',
    type: 'Number',
    dataFun: (el) => {
      return Math.floor(el * 10) / 10
    },
    nameKey: '',
    val: '100',
    unit: '°',
    rules: false,
    version: ['V1.0', 'V2.0']
  }

]

// 属性对应的nameKey根据版本返回
const nameKey = [
  {
    mark: 'sprayState',
    key: 'REG_RUN_STS',
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'sprayModel',
    key: 'REMOTE_LOCAL',
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'sprayPwm',
    key: 'REG_HMI_PWM',
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'sprayAngle',
    key: 'Angle',
    version: ['V1.0', 'V2.0']
  }
]

// 属性对应的规则
const rules = [
  {
    mark: 'sprayState',
    fun: (el) => {
      if (el.FWD_HMI || el.REV_HMI) {
        return '运行'
      } else {
        return '停止'
      }
    },
    version: ['V1.0', 'V2.0']
  }
]

/* -----------------------控制装载-------------------------- */

/**
 * @param { String } version 设备版本
 * @return { Array } 控制对象
 */
function getCommand(version) {
  const sprayCommand = {}
  command.forEach((el, index) => {
    if (el.version[0] === '*' || el.version.includes(version)) {
      el.nameKey = getActions(el.mark, version)
      el.param = getParam(el.mark, version)
      sprayCommand[el.mark] = el
    }
  })
  return sprayCommand
}

/**
 * 方法：根据版本得到控制的nameKey
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { String } 与设备版本对应的nameKey
 */
function getActions(mark, version) {
  let key
  actions.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        key = el.key
      }
    }
  })
  return key
}

/**
 * 方法：根据版本得到对应的param
 * @param { String } mark 属性标识
 * @param { String } version 设备版本
 * @return { Function } 与设备版本对应的param值
 */
function getParam(mark, version) {
  let fun = false
  params.forEach((el, index) => {
    if (el.mark === mark) {
      if (el.version[0] === '*' || el.version.includes(version)) {
        fun = el.fun
      }
    }
  })
  return fun
}

const command = [
  {
    mark: 'openSpray',
    nameKey: '',
    param: '',
    version: ['V1.0', 'V2.0']
  }
]

const actions = [
  {
    mark: 'openSpray',
    key: 'REG_CMD_PWR',
    version: ['V1.0', 'V2.0']
  }
]

const params = [
  {
    mark: 'openSpray',
    fun: () => { return 255 },
    version: ['V1.0', 'V2.0']
  }
]
