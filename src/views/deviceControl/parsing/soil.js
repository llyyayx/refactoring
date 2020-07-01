import store from '@/store'
import mapFun from '@/utils/mapFun'

// 解析土壤墒情传感器
export function soil(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setSoil', { dname, latitude, longitude, dclass, serialno,
    icon: require('@/icons/device/close/sqz.png')
  })
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/close/sqz.png') })
  clickEvent(mapSpot)
}

// 创建地图标点
function marKer(obj) {
  return mapFun.setMarker(store.state.map.map, obj)
}

/**
 * 标点点击事件
 * @param { Object } mapSpot 地图标点实例化对象
 */
function clickEvent(mapSpot) {
  mapFun.marKerClickEvent(mapSpot, () => {
    alert(6)
  })
}
