import store from '@/store'
import { getAttr } from '@/utils/setDevice'

// 解析ndvi传感器
export function ndvi(item) {
  const { dclass, serialno, dname, latitude, longitude, model } = item
  store.dispatch('device/setNdvi', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/close/sqz.png'),
    attr: getAttr(deviceAttr, model || 'V1.0') })
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置喷头图标
 * @param { String } el 喷头状态属性值
 * @param { Object } vueX 喷头设备对象
 */
function stateIcon(el, vueX) {
  if (el) {
    const run = require('@/icons/device/run/sqz.png')
    vueX.icon && (vueX.icon = run)
    vueX.mapSpot && vueX.mapSpot.setIcon(run)
  } else {
    const close = require('@/icons/device/close/sqz.png')
    vueX.icon && (vueX.icon = close)
    vueX.mapSpot && vueX.mapSpot.setIcon(close)
  }
}

const deviceAttr = {

  attr: [
    {
      mark: 'DownNir',
      name: 'DownNir',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 1000) / 1000).toFixed(3)
      },
      nameKey: '',
      val: '0.000',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'DownRed',
      name: 'DownRed',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 1000) / 1000).toFixed(3)
      },
      nameKey: '',
      val: '0.000',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'UpNir',
      name: 'UpNir',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 1000) / 1000).toFixed(3)
      },
      nameKey: '',
      val: '0.000',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'UpRed',
      name: 'UpRed',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 1000) / 1000).toFixed(3)
      },
      nameKey: '',
      val: '0.000',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'ndvi',
      name: 'NDVI',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 1000) / 1000).toFixed(3)
      },
      nameKey: '',
      val: '0.000',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    }
  ],

  attrNameKey: [
    {
      mark: 'DownNir',
      key: 'DownNir',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'DownRed',
      key: 'DownRed',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'UpNir',
      key: 'UpNir',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'UpRed',
      key: 'UpRed',
      version: ['V1.0', 'V2.0']
    }
  ],

  rules: [
    {
      mark: 'ndvi',
      fun: (el, device) => {
        const attr = device.attr
        let DownNir, DownRed, UpNir, UpRed
        attr.forEach((e) => {
          if (e.nameKey === 'DownNir') {
            DownNir = e.val
          } else if (e.nameKey === 'DownRed') {
            DownRed = e.val
          } else if (e.nameKey === 'UpNir') {
            UpNir = e.val
          } else if (e.nameKey === 'UpRed') {
            UpRed = e.val
          }
        })
        if (DownNir !== undefined && DownRed !== undefined && UpNir !== undefined && UpRed !== undefined) {
          const v1 = parseFloat(DownNir) / parseFloat(UpNir)
          const v2 = parseFloat(DownRed) / parseFloat(UpRed)
          const value = (v1 - v2) / (v1 + v2)
          return value ? (Math.floor(value * 1000) / 1000).toFixed(3) : '0.000'
        } else {
          return '0.000'
        }
      },
      version: ['V1.0', 'V2.0']
    }
  ]

}