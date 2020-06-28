import store from '@/store'
import mapFun from '@/utils/mapFun'

// 解析土壤墒情传感器
export function soil(item, self) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setSoil', { dname, latitude, longitude, dclass, serialno })
  const mapSpot = marKer({ lat: latitude, lng: longitude, icon: require('@/icons/device/run/fm.png') })
  clickEvent(mapSpot, self)
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
    self.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  })
}
