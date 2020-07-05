import store from '@/store'
import { getAttr } from '@/utils/setDevice'

// 解析冠层温度传感器
export function canopy(item) {
  const { dclass, serialno, dname, latitude, longitude, model } = item
  store.dispatch('device/setCanopy', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/close/sqz.png'),
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
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    }
  ],

  attrNameKey: [
    {
      mark: 'temp',
      key: 'Temp',
      version: ['V1.0', 'V2.0']
    }
  ]

}
