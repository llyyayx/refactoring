import store from '@/store'

// 解析作物高度传感器
export function height(item) {
  const { dclass, serialno, dname, latitude, longitude } = item
  store.dispatch('device/setHeight', { dname, latitude, longitude, dclass, serialno, icon: require('@/icons/device/close/sqz.png') })
}
