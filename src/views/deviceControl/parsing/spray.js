import store from '@/store'

// 解析喷灌
export function spray(item) {
  const { dname, latitude, longitude, dclass, serialno, extension } = item
  store.dispatch('device/setSpray', { dname, latitude, longitude, dclass, serialno, extension })
}
