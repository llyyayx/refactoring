import store from '@/store'
import { dropValve } from './dropValve'
import mapFun from '@/utils/mapFun'

// 解析滴灌
export function drops(item) {
  const { dname, latitude, longitude, dclass, serialno, cells } = item
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/run/dg.png') })
  clickEvent(mapSpot)
  store.dispatch('device/setDrops', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/run/dg.png'), mapSpot })
  if (cells) dropValve(cells, dname)
}

/**
 * 创建地图标点
 * @param { Object } obj 点参数
 * obj.lat 纬度
 * obj.lng 经度
 * icon 图标
 */
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/**
 * 标点点击事件
 * @param { Object } mapSpot 地图标点实例化对象
 * @param { Object } self 组件指针this
 */
function clickEvent(mapSpot) {
  mapFun.marKerClickEvent(mapSpot, () => {
    store.dispatch('control/dropShow', true)
  })
}
