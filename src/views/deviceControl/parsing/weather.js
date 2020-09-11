import store from '@/store'
import mapFun from '@/utils/lmapFun'
import { getAttr } from '@/utils/setDevice'

// 解析气象站
export function weather(item) {
  const { dclass, serialno, dname, latitude, longitude, rtu, model } = item
  const mapSpot = marKer({ lat: latitude, lng: longitude, dname, icon: require('@/icons/device/close/qxz.png') })
  const attr = getAttr(deviceAttr, model || 'V1.0')
  const infowindow = mapFun.infowindow(store.state.map.map, mapSpot, attr, serialno)
  store.dispatch('device/setWeather', { dname, latitude, longitude, dclass, serialno, rtu, attr, mapSpot, infowindow,
    icon: require('@/icons/device/close/qxz.png') })
}

// 创建地图标点
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/* -----------------------属性装载-------------------------- */
/**
 * 属性值加载回调：设置图标
 * @param { String } el 状态属性值
 * @param { Object } vueX 设备对象
 */
function stateIcon(el, vueX) {
  if (el) {
    const run = require('@/icons/device/run/qxz.png')
    vueX.icon && (vueX.icon = run)
    vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(run))
  } else {
    const close = require('@/icons/device/close/qxz.png')
    vueX.icon && (vueX.icon = close)
    vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(close))
  }
}

/**
 * 属性值加载回调：设置地图infowindow信息
 * @param { String } el 状态属性值
 * @param { Object } vueX 设备对象
 */
function setInfoWindow(el, vueX) {
  let content = ''
  vueX.attr.forEach((el) => {
    content += '<div style="display: flex; align-items: center;"><p style="margin: 0; font-weight:600;">' + el.name +
      ':</p><p style="margin: 0 0 0 5px; font-weight:600;">' + el.val + el.unit + '</p></div>'
  })
  vueX.infowindow && vueX.infowindow.setContent(content)
}

const deviceAttr = {
  attr: [
    {
      mark: 'ch1',
      name: '温度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      max: 60,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0']
    },
    {
      mark: 'ch2',
      name: '湿度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      max: 100,
      min: 0,
      ecType: 'line',
      ecShow: true,
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0']
    },
    {
      mark: 'ch3',
      name: '气压',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: 'hPa',
      max: 3000,
      min: 0,
      ecType: 'line',
      ecShow: true,
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0']
    },
    {
      mark: 'ch4',
      name: '照度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: 'Lux',
      max: 30000,
      min: 0,
      ecType: 'line',
      ecShow: true,
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0']
    },
    {
      mark: 'ch5',
      name: '风速',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: 'm/s',
      max: 100,
      min: 0,
      ecType: 'line',
      ecShow: true,
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0']
    },
    {
      mark: 'ch6',
      name: '降雨量',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: 'mm/h',
      max: 1000,
      min: 0,
      ecType: 'line',
      ecShow: true,
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0']
    }
  ],
  attrNameKey: [
    {
      mark: 'ch1',
      key: 'CH1',
      version: ['V1.0']
    },
    {
      mark: 'ch2',
      key: 'CH2',
      version: ['V1.0']
    },
    {
      mark: 'ch3',
      key: 'CH3',
      version: ['V1.0']
    },
    {
      mark: 'ch4',
      key: 'CH4',
      version: ['V1.0']
    },
    {
      mark: 'ch5',
      key: 'CH5',
      version: ['V1.0']
    },
    {
      mark: 'ch5',
      key: 'CH5',
      version: ['V1.0']
    }
  ]
}

