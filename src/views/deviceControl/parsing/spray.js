import store from '@/store'
import area from '../leafletArea'
import { sprayValve } from './sprayValve'
import mapFun from '@/utils/lmapFun'
import { getAttr, getCommand, getControlItem } from '@/utils/setDevice'

// 解析喷灌
export function spray(item) {
  const { dname, latitude, longitude, dclass, serialno, extension, portarrays, cells, model, rtu } = item
  // 绘制喷灌圈
  let canvas = {}
  if (cells) {
    canvas = draw({ latitude, longitude, extension, cells })
  }
  // 地图标点
  const mapSpot = marKer({ lat: latitude, lng: longitude, dname, icon: require('@/icons/device/close/pg.png') })
  clickEvent(mapSpot, serialno)

  // vuex管理
  store.dispatch('device/setSpray', { dname, latitude, longitude, dclass, serialno, extension, cells, canvas, rtu,
    mapSpot, attr: getAttr(deviceAttr, model || 'V1.0'), icon: require('@/icons/device/close/pg.png'), command: getCommand(deviceCommand, model || 'V1.0'),
    controlItem: getControlItem(controlItem, model || 'V1.0') })
  if (portarrays) sprayValve(portarrays, { dname, serialno })
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
  var extension = param.extension ? JSON.parse(param.extension.replace(/"/g, ' ').replace(/'/g, '"')) : {}
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
    lineWidth: 1,
    pgAngle: 0,
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
    parentClass: 'device-container',
    callback: () => {
      store.dispatch('control/sensorShow', true)
    }
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
 * @param { String } serialno 喷灌机编号
 */
function clickEvent(mapSpot, serialno) {
  mapFun.marKerClickEvent(mapSpot, () => {
    store.dispatch('control/sprayDevice', { serialno })
    store.dispatch('control/sprayShow', true)
  })
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置喷灌机图标
 * @param { String } el 喷灌机状态属性值
 * @param { Object } vueX 喷灌机设备对象
 */
function stateIcon(el, vueX) {
  let icon
  if (el === '运行') {
    icon = require('@/icons/device/run/pg.png')
  } else if (el === '停止') {
    icon = require('@/icons/device/close/pg.png')
  } else {
    icon = require('@/icons/device/break/pg.png')
  }
  vueX.icon && (vueX.icon = icon)
  vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(icon))
}

/**
 * 属性值加载回调：设置喷灌机角度
 * @param { String } el 喷灌机状态属性值
 * @param { Object } vueX 喷灌机设备对象
 */
function setAngle(el, vueX) {
  vueX.canvas.pgAngle = el
  if (vueX.canvas.view) {
    vueX.canvas.view.onRemove()
    vueX.canvas.view.onAdd()
    vueX.canvas.view.draw()
  }
}

/**
 * 属性值加载回调：设置喷灌机方向
 * @param { String } el 喷灌机状态属性值
 * @param { Object } vueX 喷灌机设备对象
 */
function direction(el, vueX) {
  vueX.canvas.direction = (el === '正向')
  if (vueX.canvas.view) {
    vueX.canvas.view.onRemove()
    vueX.canvas.view.onAdd()
    vueX.canvas.view.draw()
  }
}

const deviceAttr = {
  // 属性
  attr: [
    {
      mark: 'sprayState',
      name: '设备状态',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '运行' : '停止'
      },
      nameKey: '',
      val: '停止',
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
      val: '0.0',
      unit: '°',
      rules: false,
      callback: [setAngle],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'direction',
      name: '行进方向',
      type: 'Number',
      dataFun: (el) => {
        return el ? '正向' : '反向'
      },
      nameKey: '',
      val: '正向',
      unit: '',
      rules: false,
      callback: [direction],
      version: ['V1.0', 'V2.0']
    }

  ],

  // 属性对应的nameKey根据版本返回
  attrNameKey: [
    {
      mark: 'sprayState',
      key: 'System_Run',
      version: ['V1.0']
    },
    {
      mark: 'sprayState',
      key: 'REG_RUN_STS',
      version: ['V2.0']
    },
    {
      mark: 'sprayModel',
      key: 'Pivot_LocationSel',
      version: ['V1.0']
    },
    {
      mark: 'sprayModel',
      key: 'REMOTE_LOCAL',
      version: ['V2.0']
    },
    {
      mark: 'sprayPwm',
      key: 'Pivot_Velocity',
      version: ['V1.0']
    },
    {
      mark: 'sprayPwm',
      key: 'REG_HMI_PWM',
      version: ['V2.0']
    },
    {
      mark: 'sprayAngle',
      key: 'Angle',
      version: ['V1.0', 'V2.0']
    }
  ],

  // 属性对应的规则
  rules: [
    {
      mark: 'sprayState',
      fun: (el) => {
        if (el.regs !== undefined) {
          if (el.regs.SafeCircuit_State === false) {
            return '故障'
          } else if (el.regs !== undefined) {
            if (el.regs.System_Run) {
              return '运行'
            } else {
              return '停止'
            }
          }
        } else {
          if (el.status === 'offline') {
            return '掉线'
          }
        }
      },
      version: ['V1.0']
    },
    {
      mark: 'sprayState',
      fun: (el) => {
        if (el.regs.TROUBLE_HMI) {
          return '故障'
        } else {
          if (el.regs.FWD_HMI !== undefined && el.regs.REV_HMI !== undefined) {
            if (el.regs.FWD_HMI || el.regs.REV_HMI) {
              return '运行'
            } else {
              return '停止'
            }
          }
        }
      },
      version: ['V2.0']
    },
    {
      mark: 'direction',
      fun: (el) => {
        if (el.regs.Forward_HMI !== undefined && el.regs.Backward_HMI !== undefined) {
          if (el.regs.Forward_HMI) {
            return '正向'
          } else if (el.regs.Backward_HMI) {
            return '反向'
          } else {
            return '未运行'
          }
        }
      },
      version: ['V1.0']
    },
    {
      mark: 'direction',
      fun: (el) => {
        if (el.regs.FWD_HMI !== undefined && el.regs.REV_HMI !== undefined) {
          if (el.regs.FWD_HMI) {
            return '正向'
          } else if (el.regs.REV_HMI) {
            return '反向'
          } else {
            return '未运行'
          }
        }
      },
      version: ['V2.0']
    }
  ]
}

/* -----------------------控制指令装载-------------------------- */

const deviceCommand = {
  command: [
    {
      mark: 'openSpray',
      name: '启动喷灌机',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closeSpray',
      name: '停止喷灌机',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'positive',
      name: '正向行进',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'reverse',
      name: '反向行进',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'haveWater',
      name: '有水行进',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'noWater',
      name: '无水行进',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openGun',
      name: '打开尾枪',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeGun',
      name: '关闭尾枪',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'sprayPwm',
      name: '行走速率',
      nameKey: '',
      params: '',
      // 设置此项后，自动返回API中actions数组(用于适应actios中设置多个值)
      actions: false,
      version: ['V1.0', 'V2.0']
    }
  ],

  commandNameKey: [
    {
      mark: 'openSpray',
      key: 'Start_Pivot',
      version: ['V1.0']
    },
    {
      mark: 'openSpray',
      key: 'REG_CMD_PWR',
      version: ['V2.0']
    },
    {
      mark: 'closeSpray',
      key: 'Stop_Pivot',
      version: ['V1.0']
    },
    {
      mark: 'closeSpray',
      key: 'REG_CMD_PWR',
      version: ['V2.0']
    },
    {
      mark: 'positive',
      key: 'Forward_C',
      version: ['V1.0']
    },
    {
      mark: 'positive',
      key: 'REG_CMD_FWD',
      version: ['V2.0']
    },
    {
      mark: 'reverse',
      key: 'Backward_C',
      version: ['V1.0']
    },
    {
      mark: 'reverse',
      key: 'REG_CMD_RWS',
      version: ['V2.0']
    },
    {
      mark: 'haveWater',
      key: 'Nowater_C',
      version: ['V1.0']
    },
    {
      mark: 'noWater',
      key: 'Reset_Nowater_C',
      version: ['V1.0']
    },
    {
      mark: 'openGun',
      key: 'Open_EndGun',
      version: ['V1.0']
    },
    {
      mark: 'closeGun',
      key: 'Close_EndGun',
      version: ['V1.0']
    },
    {
      mark: 'sprayPwm',
      key: ['Velocity_1', 'Velocity_2', 'Velocity_3', 'Velocity_4'],
      version: ['V1.0']
    },
    {
      mark: 'sprayPwm',
      key: 'REG_CMD_PWM',
      version: ['V2.0']
    }
  ],

  params: [
    {
      mark: 'openSpray',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'openSpray',
      fun: () => { return 255 },
      version: ['V2.0']
    },
    {
      mark: 'closeSpray',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'closeSpray',
      fun: () => { return 65280 },
      version: ['V2.0']
    },
    {
      mark: 'positive',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'positive',
      fun: () => { return 255 },
      version: ['V2.0']
    },
    {
      mark: 'reverse',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'reverse',
      fun: () => { return 255 },
      version: ['V2.0']
    },
    {
      mark: 'haveWater',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'noWater',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'openGun',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'closeGun',
      fun: () => { return true },
      version: ['V1.0']
    },
    {
      mark: 'sprayPwm',
      fun: (val) => {
        return val
      },
      version: ['V1.0']
    },
    {
      mark: 'sprayPwm',
      fun: (val) => {
        val = parseInt(val)
        return parseInt('01' + val.toString(16), 16)
      },
      version: ['V2.0']
    }
  ],
  actions: [
    {
      mark: 'sprayPwm',
      fun: (nameKey, val) => {
        const actions = []
        nameKey.forEach((el) => {
          actions.push({
            namekey: el,
            params: val
          })
        })
        return actions
      },
      version: ['V1.0']
    }
  ]
}

/* -----------------------控制项装载-------------------------- */

const controlItem = [
  {
    mark: 'sprayRun',
    name: '灌机控制',
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'direction',
    name: '行进方向',
    version: ['V1.0', 'V2.0']
  },
  {
    mark: 'mode',
    name: '行进方式',
    version: ['V1.0']
  },
  {
    mark: 'gunSetting',
    name: '尾枪设置',
    version: ['V1.0']
  },
  {
    mark: 'plan',
    name: '控制模式',
    type: 'button',
    version: ['V1.0']
  },
  {
    mark: 'sprayPwm',
    name: '行走速率',
    version: ['V1.0', 'V2.0']
  }
]
