import store from '@/store'
import mapFun from '@/utils/lmapFun'
import { getAttr, getCommand, getControlItem } from '@/utils/setDevice'

// 解析施肥机
export function fertilizer(item) {
  const { dclass, serialno, dname, latitude, longitude, model } = item
  const mapSpot = marKer({ lat: latitude, lng: longitude, dname, icon: require('@/icons/device/close/sf.png') })
  store.dispatch('device/setFertilizer', { dname, latitude, longitude, dclass, serialno, mapSpot,
    icon: require('@/icons/device/close/sf.png'),
    attr: getAttr(deviceAttr, model || 'V1.0'),
    command: getCommand(deviceCommand, model || 'V1.0'),
    controlItem: getControlItem(controlItem, model || 'V1.0')
  })
}

// 创建地图标点
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/* -----------------------属性装载-------------------------- */

/**
 * 属性值加载回调：设置喷头图标
 * @param { String } el 喷头状态属性值
 * @param { Object } vueX 喷头设备对象
 */
function stateIcon(el, vueX) {
  if (el === '启动') {
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
      mark: 'into1',
      name: '进水阀1#',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '打开' : '关闭'
      },
      nameKey: '',
      val: '关闭',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'into2',
      name: '进水阀2#',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '打开' : '关闭'
      },
      nameKey: '',
      val: '关闭',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'out1',
      name: '出口阀1#',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '打开' : '关闭'
      },
      nameKey: '',
      val: '关闭',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'out2',
      name: '出口阀2#',
      type: 'boolean',
      // 转换nameKey得到值
      dataFun: (el) => {
        return el ? '打开' : '关闭'
      },
      nameKey: '',
      val: '关闭',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'stir1',
      name: '搅拌器1#',
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
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'stir2',
      name: '搅拌器2#',
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
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'flush',
      name: '清洗阀',
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
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'pump',
      name: '注肥泵',
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
      mark: 'liquid1',
      name: '1#液位',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: 'mm',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'liquid2',
      name: '2#液位',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: 'mm',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'ph',
      name: 'PH',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'ec',
      name: 'EC',
      type: 'number',
      // 转换nameKey得到值
      dataFun: (el) => {
        return Math.floor(el * 10) / 10
      },
      nameKey: '',
      val: '0.0',
      unit: '',
      // val值不采用nameKey读取方式，直接把返回状态传入即返回值, 设为false此项无效
      rules: false,
      callback: [],
      version: ['V1.0']
    },
    {
      mark: 'cumulative',
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
      mark: 'moment',
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
    }
  ],
  // 属性对应的nameKey根据版本返回
  attrNameKey: [
    {
      mark: 'into1',
      key: 'Inlet_State1',
      version: ['V1.0']
    },
    {
      mark: 'into2',
      key: 'Inlet_State2',
      version: ['V1.0']
    },
    {
      mark: 'out1',
      key: 'Outlet_State1',
      version: ['V1.0']
    },
    {
      mark: 'out2',
      key: 'Outlet_State2',
      version: ['V1.0']
    },
    {
      mark: 'stir1',
      key: 'Beater_State1',
      version: ['V1.0']
    },
    {
      mark: 'stir2',
      key: 'Beater_State2',
      version: ['V1.0']
    },
    {
      mark: 'flush',
      key: 'Flush_State',
      version: ['V1.0']
    },
    {
      mark: 'pump',
      key: 'FertPump_State',
      version: ['V1.0']
    },
    {
      mark: 'liquid1',
      key: 'LiquidLevel1_Bucket',
      version: ['V1.0']
    },
    {
      mark: 'liquid2',
      key: 'LiquidLevel2_Bucket',
      version: ['V1.0']
    },
    {
      mark: 'ph',
      key: 'PH_Act',
      version: ['V1.0']
    },
    {
      mark: 'ec',
      key: 'EC_Act',
      version: ['V1.0']
    },
    {
      mark: 'cumulative',
      key: 'TotalFlow_HMI',
      version: ['V1.0']
    },
    {
      mark: 'moment',
      key: 'FlowRate_HMI',
      version: ['V1.0']
    }
  ]

}

/* -----------------------控制指令装载-------------------------- */

const deviceCommand = {
  command: [
    {
      mark: 'openPump',
      name: '开注肥泵',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closePump',
      name: '关注肥泵',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openInto1',
      name: '开进水阀1',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeInto1',
      name: '关进水阀1',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openInto2',
      name: '开进水阀2',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeInto2',
      name: '关进水阀2',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openOut1',
      name: '开出水阀1',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeOut1',
      name: '关出水阀1',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openOut2',
      name: '开出水阀2',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeOut2',
      name: '开出水阀2',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openStir1',
      name: '开搅拌器1',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeStir1',
      name: '关搅拌器1',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openStir2',
      name: '开搅拌器2',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeStir2',
      name: '关搅拌器2',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'openFlush',
      name: '开清洗阀',
      nameKey: '',
      params: '',
      version: ['V1.0']
    },
    {
      mark: 'closeFlush',
      name: '关清洗阀',
      nameKey: '',
      params: '',
      version: ['V1.0']
    }
  ],
  commandNameKey: [
    {
      mark: 'openPump',
      key: 'Open_FertPump',
      version: ['V1.0']
    },
    {
      mark: 'closePump',
      key: 'Close_FertPump',
      version: ['V1.0']
    },
    {
      mark: 'openInto1',
      key: 'Open_InletValve1',
      version: ['V1.0']
    },
    {
      mark: 'closeInto1',
      key: 'Close_InletValve1',
      version: ['V1.0']
    },
    {
      mark: 'openInto2',
      key: 'Open_InletValve2',
      version: ['V1.0']
    },
    {
      mark: 'closeInto2',
      key: 'Close_InletValve2',
      version: ['V1.0']
    },
    {
      mark: 'openOut1',
      key: 'Open_OutletValve1',
      version: ['V1.0']
    },
    {
      mark: 'closeOut1',
      key: 'Close_OutletValve1',
      version: ['V1.0']
    },
    {
      mark: 'openOut2',
      key: 'Open_OutletValve2',
      version: ['V1.0']
    },
    {
      mark: 'closeOut2',
      key: 'Close_OutletValve2',
      version: ['V1.0']
    },
    {
      mark: 'openStir1',
      key: 'Open_Beater1',
      version: ['V1.0']
    },
    {
      mark: 'closeStir1',
      key: 'Close_Beater1',
      version: ['V1.0']
    },
    {
      mark: 'openStir2',
      key: 'Open_Beater2',
      version: ['V1.0']
    },
    {
      mark: 'closeStir2',
      key: 'Close_Beater2',
      version: ['V1.0']
    },
    {
      mark: 'openFlush',
      key: 'Open_FlushValve_T',
      version: ['V1.0']
    },
    {
      mark: 'closeFlush',
      key: 'Close_FlushValve_T',
      version: ['V1.0']
    }
  ]
}

/* -----------------------控制项装载-------------------------- */

const controlItem = [
  {
    mark: 'into',
    name: '进水阀控制',
    version: ['V1.0']
  },
  {
    mark: 'out',
    name: '出水阀控制',
    version: ['V1.0']
  },
  {
    mark: 'stir',
    name: '搅拌机控制',
    version: ['V1.0']
  },
  {
    mark: 'flush',
    name: '清洗阀控制',
    version: ['V1.0']
  },
  {
    mark: 'pump',
    name: '注肥泵控制',
    version: ['V1.0']
  }
]
