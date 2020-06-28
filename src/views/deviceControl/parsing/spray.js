import store from '@/store'
import area from '../area'
import { sprayValve } from './sprayValve'
import mapFun from '@/utils/mapFun'

// 解析喷灌
export function spray(item, self) {
  const { dname, latitude, longitude, dclass, serialno, extension, portarrays, cells } = item
  // 绘制喷灌圈
  let canvas = {}
  if (cells) {
    canvas = draw({ latitude, longitude, extension, cells }, self)
  }
  // 地图标点
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/run/pg.png') })
  clickEvent(mapSpot, self)
  // vuex管理
  store.dispatch('device/setSpray', { dname, latitude, longitude, dclass, serialno, extension, canvas,
    attr: attr, icon: require('@/icons/device/close/pg.png') })
  if (portarrays) sprayValve(portarrays, { dname })
}

// 绘制喷灌圈
function draw(param, self) {
  let id
  const cells = param.cells
  const partition = []
  const big = { smallArea: [] }
  cells.forEach((el, index) => {
    if (index !== 0 && id !== el.id) {
      partition.push(JSON.parse(JSON.stringify(big)))
      big.smallArea = []
    }
    id = el.id
    big.lfAng = el.argstart
    big.rgAng = el.argend
    big.num = el.id
    big.bigColor = el.color
    const small = {}
    small.lfrad = el.disstart
    small.rgrad = el.disend
    small.num = el.name
    small.smallColor = el.color
    big.smallArea.push(small)
    if (index === cells.length - 1) {
      partition.push(JSON.parse(JSON.stringify(big)))
    }
  })
  var extension = JSON.parse(param.extension.replace(/"/g, ' ').replace(/'/g, '"'))
  var long = extension.arm
  var lngC = 40030173
  var hu = param.latitude.split('.')[0] * Math.PI / 180
  var latC = 40030173 * Math.cos(hu)
  var lngM = (360 / latC) * long
  var latM = (360 / lngC) * long
  var swSpot = { lat: (parseFloat(param.latitude) - latM), lng: parseFloat(param.longitude) - lngM }
  var neSpot = { lat: parseFloat(param.latitude) + latM, lng: parseFloat(param.longitude) + lngM }
  // 3、绘制喷灌机canvas对象
  // eslint-disable-next-line new-cap
  const view = new area.region({
    swSpot: swSpot,
    neSpot: neSpot,
    canvasId: 'myCan',
    lineWidth: 1,
    pgAngle: 60,
    pgWidth: 3,
    pgColor: 'rgba(132,209,73,1)',
    coreColor: '#000',
    coreRadii: 5,
    complete: { start: 0, end: 0 },
    mapAdd: false,
    mapObj: self.map,
    mapHorizontalSpacing: 200,
    textShow: true,
    displayDirection: true,
    direction: true,
    allArea: partition,
    arm: long,
    allNozzle: 40
  })
  return view
}

// 创建地图标点
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/**
 * 标点点击事件
 * @param { Object } mapSpot 地图标点实例化对象
 * @param { Object } self 组件指针this
 */
function clickEvent(mapSpot, self) {
  mapFun.marKerClickEvent(mapSpot, () => {
    self.$store.dispatch('control/sprayShow', true)
  })
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
