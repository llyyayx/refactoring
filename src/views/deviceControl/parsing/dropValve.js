import store from '@/store'
import config from '@/utils/config'
import mapFun from '@/utils/lmapFun'
import { getAttr, getCommand } from '@/utils/setDevice'

/**
 * 解析分区 => 解析滴灌阀门
 * @param { Array } cells 滴灌下分区
 * @param { Object } parent 滴灌(轮灌)控制器对象
 */
export function dropValve(cells, parent) {
  const drops = []
  cells.forEach((item, index) => {
    const { name, id, idx, color, kml } = item
    store.dispatch('device/setDropsCell', { name, id, idx, color, kml })
    // 地图添加kml区域
    mapFun.mapPolygon(store.state.map.map, kml, color)
    // 得到滴灌区域下阀门
    const valve = item.devices
    valve.forEach((item2, index2) => {
      switch (item2.dclass) {
        case config.DROPS_VALVE_CLASS : {
          const { dclass, dname, latitude, longitude, rtuSerialno, serialno, pserialno, rtuPort, model } = item2
          // 阀门标点
          const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/close/fm.png'), dname })
          clickEvent(mapSpot, parent)
          drops.push({
            dclass, dname, latitude, longitude, rtuSerialno, serialno, pserialno, rtuPort, mapSpot,
            areaName: item.name, areaId: id, icon: require('@/icons/device/close/fm.png'), pname: parent.dname,
            dSerialno: parent.serialno,
            attr: getAttr(deviceAttr, model || 'V1.0'),
            command: getCommand(deviceCommand, model || 'V1.0')
          })
        } break
      }
    })
  })
  store.dispatch('device/setDropsValve', drops)
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
 * @param { Object } parent 滴灌(轮灌)控制器对象
 */
function clickEvent(mapSpot, parent) {
  mapFun.marKerClickEvent(mapSpot, () => {
    store.dispatch('control/dropDevice', parent)
    store.dispatch('control/dropShow', true)
  })
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置阀门图标
 * @param { String } el 阀门状态属性值
 * @param { Object } vueX 阀门设备对象
 */
function stateIcon(el, vueX) {
  let icon
  if (el === 'offline') {
    icon = require('@/icons/device/break/fm.png')
  } else {
    if (el) {
      icon = require('@/icons/device/run/fm.png')
    } else {
      icon = require('@/icons/device/close/fm.png')
    }
  }
  vueX.icon && (vueX.icon = icon)
  vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(icon))
}

const deviceAttr = {
  attr: [
    {
      mark: 'valveState',
      name: '阀门状态',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el
      },
      nameKey: '',
      val: '启动',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    }
  ],
  attrNameKey: [
    {
      mark: 'valveState',
      key: 'DO',
      version: ['V1.0', 'V2.0']
    }
  ],
  rules: [
    {
      mark: 'valveState',
      fun: (el) => {
        if (el.regs !== undefined) {
          if (el.regs.DO) {
            return true
          } else {
            return false
          }
        } else {
          if (el.status === 'offline') {
            return 'offline'
          }
        }
      },
      version: ['V1.0', 'V2.0']
    }
  ]
}

/* -----------------------控制指令装载-------------------------- */

const deviceCommand = {
  command: [
    {
      mark: 'openValve',
      name: '打开阀门',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closeValve',
      name: '关闭阀门',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    }
  ],
  commandNameKey: [
    {
      mark: 'openValve',
      key: 'Open_PulseValve_',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closeValve',
      key: 'Close_PulseValve_',
      version: ['V1.0', 'V2.0']
    }
  ],
  params: [
    {
      mark: 'openValve',
      fun: () => { return true },
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closeValve',
      fun: () => { return true },
      version: ['V1.0', 'V2.0']
    }
  ]
}
