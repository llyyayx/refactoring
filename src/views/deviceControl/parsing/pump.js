import store from '@/store'
import { getAttr, getCommand, getControlItem } from '@/utils/setDevice'

// 解析水泵
export function pump(item) {
  const { dclass, serialno, dname, latitude, longitude, model, rtu } = item
  store.dispatch('device/setPump', { dname, latitude, longitude, dclass, serialno, rtu,
    icon: require('@/icons/device/close/sb.png'),
    attr: getAttr(deviceAttr, model || 'V1.0'),
    command: getCommand(deviceCommand, model || 'V1.0'),
    controlItem: getControlItem(controlItem, model || 'V1.0')
  })
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置喷灌机图标
 * @param { String } el 喷灌机状态属性值
 * @param { Object } vueX 喷灌机设备对象
 */
function stateIcon(el, vueX) {
  let icon
  if (el === '启动') {
    icon = require('@/icons/device/run/pg.png')
  } else if (el === '停止') {
    icon = require('@/icons/device/close/pg.png')
  } else {
    icon = require('@/icons/device/break/pg.png')
  }
  vueX.icon && (vueX.icon = icon)
  vueX.mapSpot && vueX.mapSpot.setIcon(icon)
}

const deviceAttr = {

  attr: [
    {
      mark: 'pumpState',
      name: '设备状态',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '启动' : '停止'
      },
      nameKey: '',
      val: '停止',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [stateIcon],
      version: ['V1.0']
    },
    {
      mark: 'flow',
      name: '瞬时流量',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: 'm³/h',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'addFlow',
      name: '累计流量',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: 'm³',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'pressure',
      name: '压力',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: 'MPa',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'mode',
      name: '当前模式',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '工频模式' : '变频模式'
      },
      nameKey: '',
      val: '工频模式',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    }
  ],
  attrNameKey: [
    {
      mark: 'flow',
      key: 'Line_Flow',
      version: ['V1.0']
    },
    {
      mark: 'addFlow',
      key: 'Line_Flow_Accum',
      version: ['V1.0']
    },
    {
      mark: 'pressure',
      key: 'Line_Pressure',
      version: ['V1.0']
    },
    {
      mark: 'mode',
      key: 'mode',
      version: ['V1.0']
    }
  ],
  rules: [
    {
      mark: 'pumpState',
      fun: (el) => {
        if (el.regs !== undefined) {
          if (el.res.RUN_HMI) {
            return '启动'
          } else {
            return '停止'
          }
        } else {
          if (el.status === 'offline') {
            return '掉线'
          }
        }
      },
      version: ['V1.0']
    }
  ]

}

/* -----------------------控制指令装载-------------------------- */

const deviceCommand = {
  command: [
    {
      mark: 'switchGp',
      name: '模式切换-工频',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'switchBp',
      name: '模式切换-变频',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'Gp_openPump',
      name: '工频开泵',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'Gp_closePump',
      name: '工频关泵',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'Bp_manual',
      name: '变频手动模式',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'Bp_Auto',
      name: '变频自动模式',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'frequency',
      name: '变频手动设置频率',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'pressure',
      name: '变频自动设置压力',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'Bp_openPump',
      name: '变频开泵',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'Bp_closePump',
      name: '变频关泵',
      nameKey: '',
      params: '',
      version: ['V1.0']
    }
  ],
  commandNameKey: [
    {
      mark: 'switchGp',
      key: 'model',
      version: ['V1.0']
    },
    {
      mark: 'switchBp',
      key: 'model',
      version: ['V1.0']
    },
    {
      mark: 'Gp_openPump',
      key: 'Open_Power_VFD_R',
      version: ['V1.0']
    },
    {
      mark: 'Gp_closePump',
      key: 'Close_Power_VFD_R',
      version: ['V1.0']
    },
    {
      mark: 'Bp_manual',
      key: 'frequnce_source',
      version: ['V1.0']
    },
    {
      mark: 'Bp_Auto',
      key: 'frequnce_source',
      version: ['V1.0']
    },
    {
      mark: 'frequency',
      key: 'frequnce_in',
      version: ['V1.0']
    },
    {
      mark: 'pressure',
      key: 'pressure_in',
      version: ['V1.0']
    },
    {
      mark: 'Bp_openPump',
      key: 'Open_Converter_VFD_R',
      version: ['V1.0']
    },
    {
      mark: 'Bp_closePump',
      key: 'Close_Converter_VFD_R',
      version: ['V1.0']
    }
  ],
  params: [
    {
      mark: 'switchGp',
      fun: () => { return 0 },
      version: ['V1.0']
    },
    {
      mark: 'switchBp',
      fun: () => { return 1 },
      version: ['V1.0']
    },
    {
      mark: 'Gp_openPump',
      fun: () => { return 1 },
      version: ['V1.0']
    },
    {
      mark: 'Gp_closePump',
      fun: () => { return 0 },
      version: ['V1.0']
    },
    {
      mark: 'Bp_manual',
      fun: () => { return 1 },
      version: ['V1.0']
    },
    {
      mark: 'Bp_Auto',
      fun: () => { return 0 },
      version: ['V1.0']
    },
    {
      mark: 'frequency',
      fun: (el) => { return el },
      version: ['V1.0']
    },
    {
      mark: 'pressure',
      fun: (el) => { return el },
      version: ['V1.0']
    },
    {
      mark: 'Bp_openPump',
      fun: () => { return 1 },
      version: ['V1.0']
    },
    {
      mark: 'Bp_closePump',
      fun: () => { return 0 },
      version: ['V1.0']
    }
  ],
  actions: [
    {
      mark: 'Bp_openPump',
      fun: (pump, stateMode, modeValue) => {
        const actions = []
        // 设置到自动或手动模式
        actions.push({
          namekey: stateMode === '1' ? pump.command.Bp_manual.nameKey : pump.command.Bp_Auto.nameKey,
          params: stateMode === '1' ? pump.command.Bp_manual.params() : pump.command.Bp_Auto.params()
        })
        // 设置到自动或手动模式的值
        actions.push({
          namekey: stateMode === '1' ? pump.command.frequency.nameKey : pump.command.pressure.nameKey,
          params: stateMode === '1' ? pump.command.frequency.params(modeValue) : pump.command.pressure.params(modeValue)
        })
        // 开启变频模式下水泵
        actions.push({
          namekey: pump.command.Bp_openPump.nameKey,
          params: pump.command.Bp_openPump.params()
        })
        return actions
      },
      version: ['V1.0']
    }
  ]
}

/* -----------------------控制项装载-------------------------- */

const controlItem = [
  {
    mark: 'gp',
    name: '工频控制',
    version: ['V1.0']
  },
  {
    mark: 'bp',
    name: '变频控制',
    version: ['V1.0']
  }
]

export { deviceAttr }
