import store from '@/store'
import { getAttr } from '@/utils/setDevice'

// 解析作物高度传感器
export function height(item) {
  const { dclass, serialno, dname, latitude, longitude, model, rtu } = item
  store.dispatch('device/setHeight', { dname, latitude, longitude, dclass, serialno, rtu, icon: require('@/icons/device/close/height.png'),
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
    const run = require('@/icons/device/run/height.png')
    vueX.icon && (vueX.icon = run)
    vueX.mapSpot && vueX.mapSpot.setIcon(run)
  } else {
    const close = require('@/icons/device/close/height.png')
    vueX.icon && (vueX.icon = close)
    vueX.mapSpot && vueX.mapSpot.setIcon(close)
  }
}

const deviceAttr = {

  attr: [
    {
      mark: 'height',
      name: '高度',
      type: 'Number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return (Math.floor(el * 100) / 100).toFixed(2)
      },
      nameKey: '',
      val: '0.00',
      unit: 'm',
      max: 3,
      min: 0,
      ecType: 'line',
      ecShow: true,
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0', 'V2.0']
    }
  ],

  attrNameKey: [
    {
      mark: 'height',
      key: 'Height',
      version: ['V1.0', 'V2.0']
    }
  ]

}
