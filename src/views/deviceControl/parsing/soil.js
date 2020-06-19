import store from '@/store'

// 解析土壤墒情传感器
export function soil(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setSoil', { dname, latitude, longitude, dclass, serialno })
}
