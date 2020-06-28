import store from '@/store'
import config from '@/utils/config'
import mapFun from '@/utils/mapFun'

// 解析分区 => 解析滴灌阀门
export function dropValve(cells, pname) {
  const drops = []
  cells.forEach((item, index) => {
    const { name, id, idx, color, kml } = item
    store.dispatch('device/setDropsCell', { name, id, idx, color, kml })
    // 地图添加kml区域
    mapFun.mapPolygon(store.state.map.map, kml, color)
    // 得到滴灌区域下阀门
    const valve = item.devices
    valve.forEach((item2, index2) => {
      switch (item2.dclass) {
        case config.DROPS_VALVE_CLASS : {
          const { dclass, dname, latitude, longitude, rtuSerialno, serialno, pserialno, rtuPort } = item2
          // 阀门标点
          const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/close/fm.png') })
          clickEvent(mapSpot)
          drops.push({
            dclass, dname, latitude, longitude, rtuSerialno, serialno, pserialno, rtuPort, mapSpot,
            areaName: item.name, areaId: id, icon: require('@/icons/device/close/fm.png'), pname: pname
          })
        } break
      }
    })
  })
  store.dispatch('device/setDropsValve', drops)
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
function clickEvent(mapSpot, self) {
  /* mapFun.marKerClickEvent(mapSpot, () => {
    self.$store.dispatch('control/sprayShow', true)
  }) */
}
