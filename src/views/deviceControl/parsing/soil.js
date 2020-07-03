import store from '@/store'
import mapFun from '@/utils/mapFun'
import { getAttr } from '@/utils/setDevice'

// 解析土壤墒情传感器
export function soil(item) {
  const { dclass, serialno, dname, latitude, longitude, model } = item
  store.dispatch('device/setSoil', { dname, latitude, longitude, dclass, serialno,
    icon: require('@/icons/device/close/sqz.png'), attr: getAttr(deviceAttr, model || 'V1.0')
  })
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/close/sqz.png') })
  clickEvent(mapSpot)
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
    alert(6)
  })
}

/* -----------------------属性装载-------------------------- */
const deviceAttr = {

  attr: [
    {
      mark: 'humidity1',
      name: '湿度1',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity2',
      name: '湿度2',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity3',
      name: '湿度3',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'humidity4',
      name: '湿度4',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '%',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      version: ['V1.0', 'V2.0']
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
    }
  ]

}
