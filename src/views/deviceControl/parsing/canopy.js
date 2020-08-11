import store from '@/store'
import { getAttr } from '@/utils/setDevice'
import mapFun from '@/utils/lmapFun'

// 解析冠层温度传感器
export function canopy(item) {
  const { dclass, serialno, dname, latitude, longitude, model, extension } = item
  let mounted = false
  if (extension) {
    mounted = JSON.parse(extension).mounted
  }
  store.dispatch('device/setCanopy', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/close/sqz.png'),
    attr: getAttr(deviceAttr, model || 'V1.0'), mounted })
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
    vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(run))
  } else {
    const close = require('@/icons/device/close/sqz.png')
    vueX.icon && (vueX.icon = close)
    vueX.mapSpot && vueX.mapSpot.setIcon(mapFun.getIcon(close))
  }
}

const deviceAttr = {

  attr: [
    {
      mark: 'temp',
      name: '温度',
      type: 'Number',
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
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0']
    },
    {
      mark: 'ch1',
      name: '温度1',
      type: 'Number',
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
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V2.0']
    },
    {
      mark: 'ch2',
      name: '温度2',
      type: 'Number',
      max: 50,
      min: 0,
      ecType: 'line',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V2.0']
    },
    {
      mark: 'ch3',
      name: '温度3',
      type: 'Number',
      max: 50,
      min: 0,
      ecType: 'line',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V2.0']
    },
    {
      mark: 'ch4',
      name: '温度4',
      type: 'Number',
      max: 50,
      min: 0,
      ecType: 'line',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 10) / 10).toFixed(1)
      },
      nameKey: '',
      val: '0.0',
      unit: '℃',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
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
