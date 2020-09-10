import store from '@/store'
import { dropValve } from './dropValve'
import mapFun from '@/utils/lmapFun'

// 解析滴灌
export function drops(item) {
  const { dname, latitude, longitude, dclass, serialno, cells } = item
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/run/dg.png'), dname })
  clickEvent(mapSpot, { dname, serialno })
  store.dispatch('device/setDrops', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/run/dg.png'), mapSpot })
  if (cells) dropValve(cells, { dname, serialno })
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
 * @param { Object } drop 滴灌(轮灌)控制器对象
 */
function clickEvent(mapSpot, drop) {
  mapFun.marKerClickEvent(mapSpot, () => {
    store.dispatch('control/dropShow', true)
    store.dispatch('control/dropDevice', drop)
  })
}
