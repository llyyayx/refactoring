import store from '@/store'

// 解析气象站
export function weather(item) {
  const { dclass, serialno, dname, latitude, longitude, rtu } = item
  store.dispatch('device/setWeather', { dname, latitude, longitude, dclass, serialno, rtu })
}
