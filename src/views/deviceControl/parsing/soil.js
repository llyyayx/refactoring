import store from '@/store'
import mapFun from '@/utils/lmapFun'
import { getAttr } from '@/utils/setDevice'

// 解析土壤墒情传感器
export function soil(item) {
  const { dclass, serialno, dname, latitude, longitude, model, rtu } = item
  const mapSpot = marKer({ lat: latitude, lng: longitude, dname, icon: require('@/icons/device/close/sqz.png') })
  clickEvent(mapSpot)
  const attr = getAttr(deviceAttr, model || 'V1.0')
  const infowindow = mapFun.infowindow(store.state.map.map, mapSpot, attr, serialno)
  store.dispatch('device/setSoil', { dname, latitude, longitude, dclass, serialno, rtu,
    icon: require('@/icons/device/close/sqz.png'), attr: attr, infowindow: infowindow,
    mapSpot: mapSpot
  })
}

// 创建地图标点
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/**
 * 标点点击事件
 * @param { Object } mapSpot 地图标点实例化对象
 */
function clickEvent(mapSpot) {
  mapFun.marKerClickEvent(mapSpot, () => {
    return
  })
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置图标
 * @param { String } el 状态属性值
 * @param { Object } vueX 设备对象
 */
function stateIcon(el, vueX) {
  if (el) {
    const run = require('@/icons/device/run/sqz.png')
    vueX.icon && (vueX.icon = run)
    vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(run))
  } else {
    const close = require('@/icons/device/close/sqz.png')
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
      mark: 'humidity1',
      name: '湿度1',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity2',
      name: '湿度2',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity3',
      name: '湿度3',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity4',
      name: '湿度4',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'temp1',
      name: '20cm温度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        el = el * 0.01
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V3.0']
    },
    {
      mark: 'humidity1',
      name: '20cm湿度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        el = el * 0.01
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%RH',
      max: 100,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V3.0']
    },
    {
      mark: 'ec1',
      name: '20cm电导率',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        el = el * 0.01
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: 'us/cm',
      max: 100,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V3.0']
    },
    {
      mark: 'temp2',
      name: '40cm温度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        el = el * 0.01
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V3.0']
    },
    {
      mark: 'humidity2',
      name: '40cm湿度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        el = el * 0.01
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%RH',
      max: 100,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V3.0']
    },
    {
      mark: 'ec2',
      name: '40cm电导率',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        el = el * 0.01
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: 'us/cm',
      max: 100,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V3.0']
    }
  ],
  attrNameKey: [
    {
      mark: 'humidity1',
      key: 'CH1',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity2',
      key: 'CH2',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity3',
      key: 'CH3',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity4',
      key: 'CH4',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'temp1',
      key: 'T1',
      version: ['V3.0']
    },
    {
      mark: 'humidity1',
      key: 'M1',
      version: ['V3.0']
    },
    {
      mark: 'ec1',
      key: 'E1',
      version: ['V3.0']
    },
    {
      mark: 'temp2',
      key: 'T2',
      version: ['V3.0']
    },
    {
      mark: 'humidity2',
      key: 'M2',
      version: ['V3.0']
    },
    {
      mark: 'ec2',
      key: 'E2',
      version: ['V3.0']
    }
  ]

}
