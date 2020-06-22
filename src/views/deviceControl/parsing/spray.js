import store from '@/store'
import { sprayValve } from './sprayValve'

// 解析喷灌
export function spray(item) {
  const { dname, latitude, longitude, dclass, serialno, extension, portarrays } = item
  store.dispatch('device/setSpray', { dname, latitude, longitude, dclass, serialno, extension,
    attr: attr, icon: require('@/icons/device/close/pg.png') })
  if (portarrays) sprayValve(portarrays, { dname })
}

// 喷灌机属性
const attr = [
  { name: '设备状态', val: '停止', namekey: 'SafeCircuit_State', unit: '', valueType: 'boolean', mqtt: 1 },
  { name: '运行模式', val: '手动模式', namekey: 'bool_format_arr', unit: '', valueType: 'boolean', mqtt: 1 },
  { name: '行进方向', val: '正向行进', namekey: 'Running_Direction', unit: '', valueType: 'boolean', mqtt: 1 },
  { name: '行进方式', val: '有水行进', unit: '', namekey: 'NoWater_HMI', valueType: 'boolean', mqtt: 1 },
  { name: '尾枪状态', val: '尾枪打开', unit: '', namekey: 'EndGun_HMI', valueType: 'boolean', mqtt: 1 },
  { name: '行进速率', val: '45', unit: '%', namekey: 'Pivot_Velocity', valueType: 'number', mqtt: 1 },
  { name: '运行圈数', val: '0', unit: '', namekey: 'Running_Loops', valueType: 'number', mqtt: 1 },
  { name: '当前角度', val: '0.00', unit: '°', namekey: 'Current_Angle', valueType: 'number', mqtt: 1 },
  { name: '入机流量', val: '0.00', unit: 'm³/h', namekey: 'InFlow', valueType: 'number', mqtt: 1 },
  { name: '入机压力', val: '1.6', unit: 'Mpa', namekey: 'InPressure', valueType: 'number', mqtt: 1 },
  { name: '累计流量', val: '0.00', unit: 'm³', namekey: 'AccFlow', valueType: 'number', mqtt: 1 },
  { name: '电池电压', val: '0.00', unit: 'V', namekey: 'BatteryVolt', valueType: 'number', mqtt: 1 }
]
