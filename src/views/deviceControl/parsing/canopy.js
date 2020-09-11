import store from '@/store'
import { getAttr } from '@/utils/setDevice'
import mapFun from '@/utils/lmapFun'

// 解析冠层温度传感器
export function canopy(item) {
  const { dclass, serialno, dname, latitude, longitude, model, extension, rtu } = item
  // 传感器在喷灌机臂上判断
  let mounted = false
  let pserialno = ''
  if (extension) {
    // 在喷灌机臂上，且设置归属喷灌机
    const obj = JSON.parse(extension)
    mounted = obj.mounted
    pserialno = obj.pserialno
  }

  const attr = getAttr(deviceAttr, model || 'V1.0')

  const itemAttr = { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/close/canopy.png'),
    attr, mounted, pserialno, rtuId: rtu ? rtu.rtuid : 0, rtu }

  // 不在喷灌机臂上的设置地图标点及信息窗口
  if (!mounted) {
    const mapSpot = marKer({ lat: latitude, lng: longitude, dname, icon: require('@/icons/device/close/canopy.png') })
    const infowindow = mapFun.infowindow(store.state.map.map, mapSpot, attr, serialno)
    itemAttr.mapSpot = mapSpot
    itemAttr.infowindow = infowindow
  }
  store.dispatch('device/setCanopy', itemAttr)
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
    const run = require('@/icons/device/run/canopy.png')
    vueX.icon && (vueX.icon = run)
    vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(run))
  } else {
    const close = require('@/icons/device/close/canopy.png')
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
      mark: 'temp',
      name: '温度',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
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
      version: ['V1.0']
    },
    {
      mark: 'ch1',
      name: '温度1',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
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
      version: ['V2.0']
    },
    {
      mark: 'ch2',
      name: '温度2',
      type: 'number',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V2.0']
    },
    {
      mark: 'ch3',
      name: '温度3',
      type: 'number',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V2.0']
    },
    {
      mark: 'ch4',
      name: '温度4',
      type: 'number',
      max: 50,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon, setInfoWindow],
      version: ['V2.0']
    }
  ],

  attrNameKey: [
    {
      mark: 'temp',
      key: 'Temp',
      version: ['V1.0']
    },
    {
      mark: 'ch1',
      key: 'CH1',
      version: ['V2.0']
    },
    {
      mark: 'ch2',
      key: 'CH2',
      version: ['V2.0']
    },
    {
      mark: 'ch3',
      key: 'CH3',
      version: ['V2.0']
    },
    {
      mark: 'ch4',
      key: 'CH4',
      version: ['V2.0']
    }
  ]

}
