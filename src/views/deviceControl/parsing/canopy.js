import store from '@/store'

// 解析灌层温度传感器
export function canopy(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setCanopy', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/close/sqz.png') })
}
