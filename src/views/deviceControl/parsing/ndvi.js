import store from '@/store'

// 解析ndvi传感器
export function ndvi(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setNdvi', { dname, latitude, longitude, dclass, serialno })
}
