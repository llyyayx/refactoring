import store from '@/store'
import { getAttr, getCommand } from '@/utils/setDevice'
import config from '@/utils/config'

// 解析喷灌机喷头
export function sprayValve(portarrays, parent) {
  const spray = []
  portarrays.forEach((item, index) => {
    const { spraySerialno, rtuSerialno, port, ctlGroup, descri, idx, model } = item
    spray.push({ spraySerialno, rtuSerialno, port, ctlGroup, descri, idx,
      serialno: spraySerialno,
      dclass: config.SPRAY_VALVE_CLASS,
      icon: require('@/icons/device/close/fm.png'),
      status: 'close',
      pname: parent.dname,
      pSerialno: parent.serialno,
      attr: getAttr(deviceAttr, model || 'V1.0'),
      command: getCommand(deviceCommand, model || 'V1.0')
    })
  })
  store.dispatch('device/setSprayValve', spray)
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置喷头图标
 * @param { String } el 喷头状态属性值
 * @param { Object } vueX 喷头设备对象
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
}

const deviceAttr = {
  attr: [
    {
      mark: 'valveState',
      name: '喷头状态',
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
      name: '打开喷头',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closeValve',
      name: '关闭喷头',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'openPwm',
      name: '打开pwm模式',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closePwm',
      name: '关闭pwm模式',
      nameKey: '',
      params: '',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'setPwm',
      name: '设置PWM值',
      nameKey: '',
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
    },
    {
      mark: 'openPwm',
      key: 'PWM_EN',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closePwm',
      key: 'PWM_EN',
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'setPwm',
      key: 'SetPulse_',
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
    },
    {
      mark: 'openPwm',
      fun: () => { return true },
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'closePwm',
      fun: () => { return false },
      version: ['V1.0', 'V2.0']
    },
    {
      mark: 'setPwm',
      fun: (cycle, ratio) => {
        cycle = parseInt(cycle)
        ratio = parseInt(ratio)
        const v16 = cycle.toString(16) + ratio.toString(16)
        return parseInt(v16, 16)
      },
      version: ['V1.0', 'V2.0']
    }
  ]
}

